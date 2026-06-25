import { pool } from "../models/db.js";

const getAll = async (req, res) => {
  const { branchId } = req.user;
  try {
    const result = await pool.query(
      `SELECT ebd.*, e.name as employee_name
       FROM employee_bonuses_deductions ebd
       JOIN employees e ON ebd.employee_id = e.id
       WHERE ebd.branch_id = $1
       ORDER BY ebd.date DESC`,
      [branchId]
    );
    return res.status(200).json({ data: result.rows || [], status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const getMonthly = async (req, res) => {
  const { employee_id } = req.params;
  const { month, year } = req.query;
  const { branchId } = req.user;

  if (!month || !year) {
    return res.status(400).json({ message: "الرجاء توفير الشهر والسنة", status: false });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM employee_bonuses_deductions
       WHERE employee_id = $1 AND branch_id = $2
       AND EXTRACT(MONTH FROM date) = $3
       AND EXTRACT(YEAR FROM date) = $4
       ORDER BY date DESC`,
      [employee_id, branchId, month, year]
    );
    return res.status(200).json({ data: result.rows || [], status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const create = async (req, res) => {
  const { employee_id, type, value, date, notes } = req.body;
  const { branchId } = req.user;

  if (!employee_id || !type || !value || !date) {
    return res.status(400).json({ message: "الرجاء ملء جميع الحقول المطلوبة", status: false });
  }

  if (!["bonus", "deduction"].includes(type)) {
    return res.status(400).json({ message: "النوع يجب أن يكون bonus أو deduction", status: false });
  }

  if (Number(value) <= 0) {
    return res.status(400).json({ message: "القيمة يجب أن تكون موجبة", status: false });
  }

  try {
    const empCheck = await pool.query(
      `SELECT id FROM employees WHERE id = $1 AND branch_id = $2`,
      [employee_id, branchId]
    );
    if (empCheck.rows.length === 0) {
      return res.status(404).json({ message: "الموظف غير موجود", status: false });
    }

    const result = await pool.query(
      `INSERT INTO employee_bonuses_deductions (employee_id, branch_id, type, value, date, notes)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [employee_id, branchId, type, Number(value), date, notes || null]
    );

    return res.status(201).json({ data: result.rows[0], status: true, message: "تم الإضافة بنجاح" });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  const { branchId } = req.user;

  try {
    const result = await pool.query(
      `DELETE FROM employee_bonuses_deductions WHERE id = $1 AND branch_id = $2 RETURNING *`,
      [id, branchId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "السجل غير موجود", status: false });
    }
    return res.status(200).json({ message: "تم الحذف بنجاح", status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

export { getAll, getMonthly, create, remove };
