import { pool } from "../models/db.js";

const getAllEmployeeWithdrawals = async (req, res) => {
  const { branchId } = req.user;
  try {
    const result = await pool.query(
      `SELECT ew.*, e.name as employee_name, e.basic_salary
       FROM employee_withdrawals ew
       JOIN employees e ON ew.employee_id = e.id
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
      `SELECT ew.*, e.name as employee_name, e.basic_salary
       FROM employee_withdrawals ew
       JOIN employees e ON ew.employee_id = e.id
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
      `SELECT id, name, basic_salary FROM employees WHERE id = $1 AND branch_id = $2`,
      [employee_id, branchId]
    );

    if (employeeResult.rows.length === 0) {
      return res.status(404).json({ message: "الموظف غير موجود", status: false });
    }

    const employee = employeeResult.rows[0];
    const basicSalary = parseFloat(employee.basic_salary);

    if (value > basicSalary) {
      return res.status(400).json({
        message: `لا يمكن السحب أكثر من الراتب الأساسي (${basicSalary})`,
        status: false
      });
    }

    const withdrawalDate = new Date(date);
    const month = withdrawalDate.getMonth() + 1;
    const year = withdrawalDate.getFullYear();

    const totalWithdrawnResult = await pool.query(
      `SELECT COALESCE(SUM(value), 0) as total
       FROM employee_withdrawals
       WHERE employee_id = $1
       AND EXTRACT(MONTH FROM date) = $2
       AND EXTRACT(YEAR FROM date) = $3`,
      [employee_id, month, year]
    );

    const totalWithdrawn = parseFloat(totalWithdrawnResult.rows[0].total);

    if (totalWithdrawn + value > basicSalary) {
      return res.status(400).json({
        message: `إجمالي السحوبات في هذا الشهر (${totalWithdrawn}) مع هذا السحب يتجاوز الراتب الأساسي (${basicSalary})`,
        status: false
      });
    }

    const result = await pool.query(
      `INSERT INTO employee_withdrawals (employee_id, value, date, notes, branch_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [employee_id, value, date, notes || null, branchId]
    );

    return res.status(201).json({ data: result.rows[0], status: true, message: "تم تسجيل السحب بنجاح وسيُخصم من راتب الشهر" });
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
