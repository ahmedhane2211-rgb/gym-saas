import { pool } from "../models/db.js";

const getAllEmployees = async (req, res) => {
  const { user } = req;
  const { branchId } = user;

  try {
    const result = await pool.query(
      `SELECT 
        employees.*, 
        users.full_name AS name,
        json_build_object(
          'id', users.id,
          'full_name', users.full_name,
          'email', users.email,
          'phone', users.phone,
          'role', users.role,
          'created_at', users.created_at,
          'gender', users.gender,
          'address', users.address,
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
      `SELECT 
        employees.*, 
        users.full_name AS name,
        users.email,
        users.phone,
        users.gender,
        json_build_object(
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
    allowances,
    basic_salary,
    date_of_joining,
    description,
    health_insurance,
    job_number,
    marital_status,
    national_id,
    nationality,
    pending_debt,
    plain_password,
    qualification,
    social_insurance,
    tax,
    total_salary,
    user_id,
  } = req.body;
  const { branchId } = req.user;

  if (!user_id || basic_salary === undefined) {
    return res.status(400).json({ message: "الرجاء ملء جميع الحقول المطلوبة", status: false });
  }

  if (basic_salary < 0 || (additional_salary && additional_salary < 0)) {
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

    const insertResult = await pool.query(
      `INSERT INTO employees (
        additional_salary, allowances, basic_salary, date_of_joining,
        description, health_insurance, job_number, marital_status,
        national_id, nationality, pending_debt, plain_password,
        qualification, social_insurance, tax, total_salary, user_id, branch_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
      ) RETURNING id`,
      [
        additional_salary || 0,
        allowances || 0,
        basic_salary,
        date_of_joining || null,
        description || null,
        health_insurance || 0,
        job_number || null,
        marital_status || null,
        national_id || null,
        nationality || null,
        pending_debt || 0,
        plain_password || null,
        qualification || null,
        social_insurance || 0,
        tax || 0,
        total_salary || 0,
        user_id,
        userExists.rows[0].branch_id,
      ],
    );

    // Fetch the inserted employee joined with user details
    const newEmployee = await pool.query(
      `SELECT 
        employees.*, 
        users.full_name AS name,
        users.email,
        users.phone,
        users.gender,
        json_build_object(
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
      WHERE employees.id = $1`,
      [insertResult.rows[0].id]
    );

    return res.status(201).json({ data: newEmployee.rows[0], status: true, message: "تم إنشاء الموظف بنجاح" });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const {
    additional_salary,
    allowances,
    basic_salary,
    date_of_joining,
    description,
    health_insurance,
    job_number,
    marital_status,
    national_id,
    nationality,
    pending_debt,
    plain_password,
    qualification,
    social_insurance,
    tax,
    total_salary,
    user_id,
    active
  } = req.body;
  const { branchId } = req.user;

  if (!id) {
    return res.status(400).json({ message: "الرجاء توفير معرف الموظف", status: false });
  }

  if (!user_id || basic_salary === undefined) {
    return res.status(400).json({ message: "الرجاء ملء جميع الحقول المطلوبة", status: false });
  }

  if (basic_salary < 0 || (additional_salary && additional_salary < 0)) {
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

    const updateResult = await pool.query(
      `UPDATE employees SET
        additional_salary=$1, allowances=$2, basic_salary=$3,
        date_of_joining=$4, description=$5, health_insurance=$6,
        job_number=$7, marital_status=$8, national_id=$9, nationality=$10,
        pending_debt=$11, plain_password=$12, qualification=$13,
        social_insurance=$14, tax=$15, total_salary=$16, user_id=$17,
        branch_id=$18, active=$19
      WHERE id=$20 AND branch_id=$18
      RETURNING id`,
      [
        additional_salary || 0,
        allowances || 0,
        basic_salary || 0,
        date_of_joining || null,
        description || null,
        health_insurance || 0,
        job_number || null,
        marital_status || null,
        national_id || null,
        nationality || null,
        pending_debt || 0,
        plain_password || null,
        qualification || null,
        social_insurance || 0,
        tax || 0,
        total_salary || 0,
        user_id,
        userExists.rows[0].branch_id,
        active,
        id,
      ],
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ message: "الموظف غير موجود", status: false });
    }

    // Fetch the updated employee joined with user details
    const updatedEmployee = await pool.query(
      `SELECT 
        employees.*, 
        users.full_name AS name,
        users.email,
        users.phone,
        users.gender,
        json_build_object(
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
      WHERE employees.id = $1`,
      [id]
    );

    return res.status(200).json({ data: updatedEmployee.rows[0], status: true, message: "تم تحديث الموظف بنجاح" });
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