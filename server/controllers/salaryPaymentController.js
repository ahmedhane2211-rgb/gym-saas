import { pool } from "../models/db.js";

const getAllPayments = async (req, res) => {
  const { branchId } = req.user;
  try {
    const result = await pool.query(
      `SELECT sp.*, e.name as employee_name
       FROM salary_payments sp
       JOIN employees e ON sp.employee_id = e.id
       WHERE sp.branch_id = $1
       ORDER BY sp.year DESC, sp.month DESC`,
      [branchId]
    );
    return res.status(200).json({ data: result.rows || [], status: true });
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
      `SELECT id, name, basic_salary FROM employees WHERE id = $1 AND branch_id = $2`,
      [employee_id, branchId]
    );
    if (empResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "الموظف غير موجود", status: false });
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

    const net_salary = basic_salary + total_bonuses - total_deductions - total_withdrawals;

    if (net_salary < 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "الخصومات والمسحوبات تتجاوز الراتب الأساسي", status: false });
    }

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

export { getAllPayments, getEmployeePayments, paySalary };
