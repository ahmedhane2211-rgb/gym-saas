import { pool } from "../models/db.js";

const getAllEmployees = async (req, res) => {
  const { user } = req;
  const { branchId } = user;

  try {
    // Auto-create employee records for any coach or reception users that don't have one
    await pool.query(
      `INSERT INTO employees (user_id, branch_id, name, email, phone, gender, basic_salary, total_salary, date_of_joining, active, created_at)
       SELECT id, branch_id, full_name, email, phone, gender, 0, 0, CURRENT_DATE, true, NOW()
       FROM users
       WHERE role IN ('coach', 'reception') AND branch_id = $1
       AND NOT EXISTS (
         SELECT 1 FROM employees WHERE employees.user_id = users.id
       )`,
      [branchId]
    );

    const result = await pool.query(
      `SELECT employees.*, json_build_object(
        'id', users.id,
        'full_name', users.full_name,
        'email', users.email,
        'phone', users.phone,
        'role', users.role,
        'created_at', users.created_at,
        'gender', users.gender,
        'date_of_birthday', users.date_of_birthday
      ) as user
      FROM employees
      JOIN users ON employees.user_id = users.id
      WHERE users.branch_id = $1
      ORDER BY employees.created_at DESC`,
      [branchId],
    );

    return res.status(200).json({ data: result.rows || [], status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const getEmployee = async (req, res) => {
  const { id } = req.params;
  const { branchId } = req.user;

  if (!id) {
    return res.status(400).json({ message: "الرجاء توفير معرف الموظف", status: false });
  }

  try {
    const result = await pool.query(
      `SELECT employees.*, json_build_object(
        'id', users.id,
        'full_name', users.full_name,
        'email', users.email,
        'phone', users.phone,
        'role', users.role,
        'created_at', users.created_at,
        'gender', users.gender,
        'date_of_birthday', users.date_of_birthday
      ) as user
      FROM employees
      JOIN users ON employees.user_id = users.id
      WHERE employees.id = $1 AND users.branch_id = $2`,
      [id, branchId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "الموظف غير موجود", status: false });
    }

    return res.status(200).json({ data: result.rows[0], status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const createEmployee = async (req, res) => {
  const {
    additional_salary,
    address,
    allowances,
    basic_salary,
    date_of_joining,
    description,
    email,
    health_insurance,
    job_number,
    marital_status,
    name,
    national_id,
    nationality,
    pending_debt,
    phone,
    plain_password,
    qualification,
    social_insurance,
    tax,
    total_salary,
    gender,
    user_id,
  } = req.body;
  const { branchId } = req.user;
  if (!email || !phone || !gender || !user_id || !basic_salary) {
    return res.status(400).json({ message: "الرجاء ملء جميع الحقول المطلوبة", status: false });
  }

  if (basic_salary < 0 || additional_salary < 0) {
  return res.status(400).json({ message: "الراتب لازم يكون موجب", status: false });
}

if (date_of_joining && new Date(date_of_joining) > new Date()) {
  return res.status(400).json({ message: "تاريخ التعيين مش يكون في المستقبل", status: false });
}

  try {
    const userExists = await pool.query(
      "SELECT id, full_name, branch_id FROM users WHERE id = $1 AND branch_id = $2",
      [user_id, branchId],
    );

    if (userExists.rows.length === 0) {
      return res.status(404).json({ message: "المستخدم غير موجود", status: false });
    }

    const existingEmployee = await pool.query(
      "SELECT id FROM employees WHERE user_id = $1",
      [user_id],
    );

    if (existingEmployee.rows.length > 0) {
      return res.status(400).json({ message: "هذا المستخدم مسجل كموظف بالفعل", status: false });
    }

    const result = await pool.query(
      `INSERT INTO employees (
        additional_salary, address, allowances, basic_salary, date_of_joining,
        description, email, health_insurance, job_number, marital_status,
        name, national_id, nationality, pending_debt, phone, plain_password,
        qualification, social_insurance, tax, total_salary, gender, user_id, branch_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21, $22, $23
      ) RETURNING *`,
      [
        additional_salary || 0,
        address || null,
        allowances || 0,
        basic_salary,
        date_of_joining || null,
        description || null,
        email,
        health_insurance || 0,
        job_number || null,
        marital_status || null,
        name || userExists.rows[0].full_name,
        national_id || null,
        nationality || null,
        pending_debt || 0,
        phone,
        plain_password || null,
        qualification || null,
        social_insurance || 0,
        tax || 0,
        total_salary || 0,
        gender,
        user_id,
        userExists.rows[0].branch_id,
      ],
    );

    return res.status(201).json({ data: result.rows[0], status: true, message: "تم إنشاء الموظف بنجاح" });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const {
    additional_salary,
    address,
    allowances,
    basic_salary,
    date_of_joining,
    description,
    email,
    health_insurance,
    job_number,
    marital_status,
    name,
    national_id,
    nationality,
    pending_debt,
    phone,
    plain_password,
    qualification,
    social_insurance,
    tax,
    total_salary,
    gender,
    user_id,
  } = req.body;
  const { branchId } = req.user;

  if (!id) {
    return res.status(400).json({ message: "الرجاء توفير معرف الموظف", status: false });
  }

  if (!email || !phone || !gender || !user_id || !basic_salary) {
    return res.status(400).json({ message: "الرجاء ملء جميع الحقول المطلوبة", status: false });
  }

  if (basic_salary < 0 || additional_salary < 0) {
  return res.status(400).json({ message: "الراتب لازم يكون موجب", status: false });
}

if (date_of_joining && new Date(date_of_joining) > new Date()) {
  return res.status(400).json({ message: "تاريخ التعيين مش يكون في المستقبل", status: false });
}

  try {
    const userExists = await pool.query(
      "SELECT id, full_name, branch_id FROM users WHERE id = $1 AND branch_id = $2",
      [user_id, branchId],
    );

    if (userExists.rows.length === 0) {
      return res.status(404).json({ message: "المستخدم غير موجود", status: false });
    }

    const existingEmployee = await pool.query(
      "SELECT id FROM employees WHERE user_id = $1 AND id != $2",
      [user_id, id],
    );

    if (existingEmployee.rows.length > 0) {
      return res.status(400).json({ message: "هذا المستخدم مسجل كموظف بالفعل", status: false });
    }

    const result = await pool.query(
      `UPDATE employees SET
        additional_salary=$1, address=$2, allowances=$3, basic_salary=$4,
        date_of_joining=$5, description=$6, email=$7, health_insurance=$8,
        job_number=$9, marital_status=$10, name=$11, national_id=$12, nationality=$13,
        pending_debt=$14, phone=$15, plain_password=$16, qualification=$17,
        social_insurance=$18, tax=$19, total_salary=$20, gender=$21, user_id=$22,
        branch_id=$23
      WHERE id=$24 AND branch_id=$23
      RETURNING *`,
      [
        additional_salary || 0,
        address || null,
        allowances || 0,
        basic_salary || 0,
        date_of_joining || null,
        description || null,
        email,
        health_insurance || 0,
        job_number || null,
        marital_status || null,
        name || userExists.rows[0].full_name,
        national_id || null,
        nationality || null,
        pending_debt || 0,
        phone,
        plain_password || null,
        qualification || null,
        social_insurance || 0,
        tax || 0,
        total_salary || 0,
        gender,
        user_id,
        userExists.rows[0].branch_id,
        id,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "الموظف غير موجود", status: false });
    }

    return res.status(200).json({ data: result.rows[0], status: true, message: "تم تحديث الموظف بنجاح" });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  const { branchId } = req.user;

  if (!id) {
    return res.status(400).json({ message: "الرجاء توفير معرف الموظف", status: false });
  }

  try {
    const result = await pool.query(
      `DELETE FROM employees
      USING users
      WHERE employees.user_id = users.id
        AND employees.id = $1
        AND users.branch_id = $2
      RETURNING employees.*`,
      [id, branchId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "الموظف غير موجود", status: false });
    }

    return res.status(200).json({ message: "تم حذف الموظف بنجاح", status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

export { getAllEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee };
