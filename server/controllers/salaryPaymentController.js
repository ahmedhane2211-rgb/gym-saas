import { pool } from "../models/db.js";

const getAllPayments = async (req, res) => {
  const { branchId } = req.user;
  try {
    const result = await pool.query(
      `SELECT sp.*, u.full_name as employee_name
       FROM salary_payments sp
       JOIN employees e ON sp.employee_id = e.id
       JOIN users u ON e.user_id = u.id
       WHERE sp.branch_id = $1
       ORDER BY sp.year DESC, sp.month DESC`,
      [branchId]
    );
    return res.status(200).json({ data: result.rows || [], status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const getMonthlyPayments = async (req, res) => {
  const { branchId } = req.user;
  const { month, year } = req.query;

  if (!month || !year) {
    return res.status(400).json({ message: "الرجاء توفير الشهر والسنة", status: false });
  }

  try {
    // 1. Get all employees in the branch
    const employeesRes = await pool.query(
      `SELECT e.*, 
              u.full_name as name, 
              u.email, 
              u.phone,
              u.gender,
              u.address,
              u.created_at as user_created_at
       FROM employees e
       JOIN users u ON e.user_id = u.id
       WHERE e.branch_id = $1`,
      [branchId]
    );

    // 2. Fetch all salary payments for this month/year
    const paymentsRes = await pool.query(
      `SELECT * FROM salary_payments 
       WHERE branch_id = $1 AND month = $2 AND year = $3`,
      [branchId, month, year]
    );

    // 3. Fetch all withdrawals for this month/year
    const withdrawalsRes = await pool.query(
      `SELECT * FROM employee_withdrawals 
       WHERE branch_id = $1 AND EXTRACT(MONTH FROM date) = $2 AND EXTRACT(YEAR FROM date) = $3`,
      [branchId, month, year]
    );

    // 4. Fetch all bonuses/deductions for this month/year
    const bonusesRes = await pool.query(
      `SELECT * FROM employee_bonuses_deductions 
       WHERE branch_id = $1 AND EXTRACT(MONTH FROM date) = $2 AND EXTRACT(YEAR FROM date) = $3`,
      [branchId, month, year]
    );

    const formattedData = employeesRes.rows.map((emp) => {
      const payment = paymentsRes.rows.find(p => p.employee_id === emp.id);
      
      const empWithdrawals = withdrawalsRes.rows.filter(w => w.employee_id === emp.id);
      const totalWithdrawals = empWithdrawals.reduce((sum, w) => sum + parseFloat(w.value || 0), 0);

      const empBonuses = bonusesRes.rows.filter(b => b.employee_id === emp.id);
      
      const totalRewards = empBonuses.filter(b => b.type === 'bonus').reduce((sum, b) => sum + parseFloat(b.value || 0), 0);
      const totalDiscounts = empBonuses.filter(b => b.type === 'deduction').reduce((sum, b) => sum + parseFloat(b.value || 0), 0);

      const net_salary = payment 
        ? parseFloat(payment.net_salary)
        : Math.max(0, parseFloat(emp.total_salary || 0) + totalRewards - totalDiscounts - totalWithdrawals - parseFloat(emp.pending_debt || 0));

      const payment_status = payment ? "تم القبض" : "لم يتم القبض";

      return {
        uuid: emp.uuid || emp.id,
        employees: {
          id: emp.id,
          uuid: emp.uuid || emp.id,
          active: emp.active ? 1 : 0,
          store_id: branchId,
          name: emp.name,
          type: emp.gender || "male",
          date_of_birth: emp.date_of_birth,
          address: emp.address,
          date_of_joining: emp.date_of_joining,
          email: emp.email,
          phone: emp.phone,
          nationality: emp.nationality,
          user_id: emp.user_id,
          national_id: emp.national_id,
          job_number: emp.job_number,
          qualification: emp.qualification,
          marital_status: emp.marital_status,
          basic_salary: emp.basic_salary,
          additional_salary: emp.additional_salary,
          health_insurance: emp.health_insurance,
          social_insurance: emp.social_insurance,
          tax: emp.tax,
          allowances: emp.allowances,
          total_salary: emp.total_salary,
          description: emp.description,
          plain_password: null,
          created_at: emp.created_at,
          updated_at: emp.updated_at,
          pending_debt: emp.pending_debt
        },
        basic_salary: emp.total_salary || emp.basic_salary,
        total_rewards: totalRewards,
        total_discounts: totalDiscounts,
        withdrawals: {
          data: empWithdrawals.map(w => ({
            id: w.id,
            uuid: w.uuid || w.id,
            store_id: branchId,
            driver_id: null,
            employee_id: emp.id,
            type: "employee",
            value: w.value,
            date: w.date ? w.date.toISOString().split("T")[0] : null,
            notes: w.notes,
            created_at: w.created_at,
            updated_at: w.updated_at
          })),
          total: totalWithdrawals
        },
        rewards_discount_wastes: {
          rewards_discount: empBonuses.map(b => ({
            id: b.id,
            uuid: b.uuid || b.id,
            store_id: branchId,
            driver_id: null,
            employee_id: emp.id,
            user_type: "employee",
            type: b.type === 'bonus' ? 0 : 1,
            notes: b.notes,
            value: b.value,
            date: b.date ? b.date.toISOString().split("T")[0] : null,
            created_at: b.created_at,
            updated_at: b.updated_at
          }))
        },
        net_salary: net_salary,
        payment_status: payment_status
      };
    });

    return res.status(200).json({ data: formattedData, status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const getEmployeePayments = async (req, res) => {
  const { employee_id } = req.params;
  const { branchId } = req.user;
  try {
    const result = await pool.query(
      `SELECT * FROM salary_payments
       WHERE employee_id = $1 AND branch_id = $2
       ORDER BY year DESC, month DESC`,
      [employee_id, branchId]
    );
    return res.status(200).json({ data: result.rows || [], status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const paySalary = async (req, res) => {
  const { employee_id, month, year, notes } = req.body;
  const { branchId } = req.user;

  if (!employee_id || !month || !year) {
    return res.status(400).json({ message: "الرجاء توفير الموظف والشهر والسنة", status: false });
  }

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  if (Number(year) > currentYear || (Number(year) === currentYear && Number(month) > currentMonth)) {
    return res.status(400).json({ message: "لا يمكن دفع راتب شهر مستقبلي مسبقاً", status: false });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT 1 FROM branches WHERE id = $1 FOR UPDATE", [branchId]);

    const empResult = await client.query(
      `SELECT e.id, u.full_name as name, e.basic_salary, e.total_salary, e.pending_debt, e.active
       FROM employees e JOIN users u ON e.user_id = u.id
       WHERE e.id = $1 AND e.branch_id = $2`,
      [employee_id, branchId]
    );
    if (empResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "الموظف غير موجود", status: false });
    }
    if (!empResult.rows[0].active) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "لا يمكن دفع راتب لموظف غير نشط", status: false });
    }

    const alreadyPaid = await client.query(
      `SELECT id FROM salary_payments WHERE employee_id = $1 AND month = $2 AND year = $3 AND branch_id = $4`,
      [employee_id, month, year, branchId]
    );
    if (alreadyPaid.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "تم دفع راتب هذا الموظف لهذا الشهر مسبقاً", status: false });
    }

    const basic_salary = Number(empResult.rows[0].basic_salary);

    const bonusRes = await client.query(
      `SELECT COALESCE(SUM(value), 0) as total FROM employee_bonuses_deductions
       WHERE employee_id = $1 AND branch_id = $2 AND type = 'bonus'
       AND EXTRACT(MONTH FROM date) = $3 AND EXTRACT(YEAR FROM date) = $4`,
      [employee_id, branchId, month, year]
    );
    const total_bonuses = Number(bonusRes.rows[0].total);

    const deductRes = await client.query(
      `SELECT COALESCE(SUM(value), 0) as total FROM employee_bonuses_deductions
       WHERE employee_id = $1 AND branch_id = $2 AND type = 'deduction'
       AND EXTRACT(MONTH FROM date) = $3 AND EXTRACT(YEAR FROM date) = $4`,
      [employee_id, branchId, month, year]
    );
    const total_deductions = Number(deductRes.rows[0].total);

    const withdrawRes = await client.query(
      `SELECT COALESCE(SUM(value), 0) as total FROM employee_withdrawals
       WHERE employee_id = $1 AND branch_id = $2
       AND EXTRACT(MONTH FROM date) = $3 AND EXTRACT(YEAR FROM date) = $4`,
      [employee_id, branchId, month, year]
    );
    const total_withdrawals = Number(withdrawRes.rows[0].total);
    const totalSalary = Number(empResult.rows[0].total_salary || empResult.rows[0].basic_salary || 0);
    const pendingDebt = Number(empResult.rows[0].pending_debt || 0);

    // Calculate actual net salary factoring in previous pending debt
    const calculatedNet = totalSalary + total_bonuses - total_deductions - total_withdrawals - pendingDebt;

    let net_salary = calculatedNet;
    let newPendingDebt = 0;

    if (calculatedNet < 0) {
      net_salary = 0;
      newPendingDebt = Math.abs(calculatedNet);
    }

    // Update pending_debt on employee
    await client.query(
      `UPDATE employees SET pending_debt = $1 WHERE id = $2`,
      [newPendingDebt, employee_id]
    );

    const cashDay = await client.query(
      `SELECT total_value FROM cash_report WHERE branch_id = $1 ORDER BY created_at DESC, id DESC LIMIT 1`,
      [branchId]
    );
    const currentTotal = cashDay.rowCount > 0 ? Number(cashDay.rows[0].total_value) : 0;

    if (currentTotal < net_salary) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        message: `رصيد الخزنة غير كافٍ، الرصيد الحالي: ${currentTotal}، الراتب المستحق: ${net_salary}`,
        status: false
      });
    }

    const payResult = await client.query(
      `INSERT INTO salary_payments
        (employee_id, branch_id, month, year, basic_salary, bonuses, deductions, withdrawals, net_salary, notes, date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_DATE) RETURNING *`,
      [employee_id, branchId, month, year, basic_salary, total_bonuses, total_deductions, total_withdrawals, net_salary, notes || null]
    );

    await client.query(
      `INSERT INTO cash_report (type, value, total_value, branch_id) VALUES ($1, $2, $3, $4)`,
      [`راتب موظف - ${empResult.rows[0].name}`, -net_salary, currentTotal - net_salary, branchId]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      data: payResult.rows[0],
      status: true,
      message: `تم دفع راتب ${empResult.rows[0].name} بنجاح، الصافي: ${net_salary}`
    });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ message: error.message, status: false });
  } finally {
    client.release();
  }
};

export { getAllPayments, getMonthlyPayments, getEmployeePayments, paySalary };
