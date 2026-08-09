import { pool } from "../models/db.js";

const getAllEmployeeWithdrawals = async (req, res) => {
  const { branchId } = req.user;
  try {
    const result = await pool.query(
      `SELECT ew.*, u.full_name as employee_name, e.basic_salary
       FROM employee_withdrawals ew
       JOIN employees e ON ew.employee_id = e.id
       JOIN users u ON e.user_id = u.id
       WHERE e.branch_id = $1
       ORDER BY ew.date DESC`,
      [branchId]
    );
    return res.status(200).json({ data: result.rows || [], status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const getEmployeeWithdrawal = async (req, res) => {
  const { id } = req.params;
  const { branchId } = req.user;
  try {
    const result = await pool.query(
      `SELECT ew.*, u.full_name as employee_name, e.basic_salary
       FROM employee_withdrawals ew
       JOIN employees e ON ew.employee_id = e.id
       JOIN users u ON e.user_id = u.id
       WHERE ew.id = $1 AND e.branch_id = $2`,
      [id, branchId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "السجل غير موجود", status: false });
    }
    return res.status(200).json({ data: result.rows[0], status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const createEmployeeWithdrawal = async (req, res) => {
  const { employee_id, value, date, notes } = req.body;
  const { branchId } = req.user;

  if (!employee_id || !value || !date) {
    return res.status(400).json({ message: "الرجاء ملء جميع الحقول المطلوبة (الموظف، القيمة، التاريخ)", status: false });
  }

  if (value <= 0) {
    return res.status(400).json({ message: "القيمة يجب أن تكون موجبة", status: false });
  }

  try {
    const employeeResult = await pool.query(
      `SELECT id, total_salary, active FROM employees WHERE id = $1 AND branch_id = $2`,
      [employee_id, branchId]
    );

    if (employeeResult.rows.length === 0) {
      return res.status(404).json({ message: "الموظف غير موجود", status: false });
    }

    if (!employeeResult.rows[0].active) {
      return res.status(400).json({ message: "لا يمكن تسجيل سحب لموظف غير نشط", status: false });
    }

    const employee = employeeResult.rows[0];
    const withdrawalDate = new Date(date);

    // Verify cash report has enough balance
    const cashDay = await pool.query(
      `SELECT total_value FROM cash_report WHERE branch_id = $1 ORDER BY created_at DESC, id DESC LIMIT 1`,
      [branchId]
    );
    const currentTotal = cashDay.rowCount > 0 ? Number(cashDay.rows[0].total_value) : 0;

    if (currentTotal < value) {
      return res.status(400).json({
        message: `رصيد الخزنة غير كافٍ، الرصيد الحالي: ${currentTotal}، قيمة السحب المطلوبة: ${value}`,
        status: false
      });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Lock branch for update
      await client.query("SELECT 1 FROM branches WHERE id = $1 FOR UPDATE", [branchId]);

      // Insert employee withdrawal
      const result = await client.query(
        `INSERT INTO employee_withdrawals (employee_id, value, date, notes, branch_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [employee_id, value, date + "T12:00:00", notes || null, branchId]
      );

      // Insert cash report transaction
      const empNameRes = await client.query(
        `SELECT u.full_name FROM employees e JOIN users u ON e.user_id = u.id WHERE e.id = $1`,
        [employee_id]
      );
      const empName = empNameRes.rows[0]?.full_name || "موظف";
      await client.query(
        `INSERT INTO cash_report (type, value, total_value, branch_id) VALUES ($1, $2, $3, $4)`,
        [`سحب موظف - ${empName}`, -value, currentTotal - value, branchId]
      );

      await client.query("COMMIT");
      return res.status(201).json({ data: result.rows[0], status: true, message: "تم تسجيل السحب بنجاح وخصمه من الخزينة وسيُخصم من راتب الموظف" });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const deleteEmployeeWithdrawal = async (req, res) => {
  const { id } = req.params;
  const { branchId } = req.user;

  if (!id) {
    return res.status(400).json({ message: "الرجاء توفير المعرف", status: false });
  }

  try {
    const record = await pool.query(
      `SELECT ew.* FROM employee_withdrawals ew
       JOIN employees e ON ew.employee_id = e.id
       WHERE ew.id = $1 AND e.branch_id = $2`,
      [id, branchId]
    );

    if (record.rows.length === 0) {
      return res.status(404).json({ message: "السجل غير موجود", status: false });
    }

    await pool.query(`DELETE FROM employee_withdrawals WHERE id = $1`, [id]);

    return res.status(200).json({ message: "تم الحذف بنجاح", status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

export { getAllEmployeeWithdrawals, getEmployeeWithdrawal, createEmployeeWithdrawal, deleteEmployeeWithdrawal };
