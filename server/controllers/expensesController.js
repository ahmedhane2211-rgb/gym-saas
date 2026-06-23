import { pool } from "../models/db.js"

const getAllExpenses = async (req, res) => {
  const { user } = req;
  const { branchId } = user;
  
  try {
    let query = 'SELECT * FROM expenses WHERE branch_id = $1';
    const params = [branchId];
    
    if (branchId) {
      query += ' AND branch_id = $' + (params.length + 1);
      params.push(branchId);
    }
    
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    return res.status(200).json({ data: result.rows || [], status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
}

const getExpense = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('SELECT * FROM expenses WHERE id=$1', [id])
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "المصروف غير موجود", status: false });
    }
    return res.status(200).json({ data: result.rows[0], status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
}

const createExpense = async (req, res) => {
  const {
    name,
    note,
  } = req.body;
  const { branchId } = req.user;
  if (!name) {
    return res
      .status(400)
      .json({ message: "الرجاء ملء جميع الحقول (الاسم)", status: false });
  }
  
  if (!branchId) {
    return res
      .status(400)
      .json({ message: "الرجاء ملء جميع الحقول (الفرع)", status: false });
  }

  try {
    const branchExists = await pool.query(
      `SELECT * FROM branches WHERE id = $1`, [branchId]
    );
    if (branchExists.rows.length === 0) {
      return res
        .status(400)
        .json({ message: "الفرع غير موجود", status: false });
    }

    const result = await pool.query(
      `INSERT INTO expenses (
        name, note, branch_id
      ) VALUES ($1, $2, $3) RETURNING *`,
      [ name, note || null, branchId],
    );
    
    res.status(201).json({ data: result.rows[0], status: true, message: "تم إنشاء المصروف بنجاح" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
}

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, note } = req.body;
    const { branchId } = req.user;
    const updatedAt = new Date();
    
    if (!id) {
      return res.status(400).json({ message: "الرجاء توفير معرف المصروف", status: false });
    }

    const result = await pool.query(
      `UPDATE expenses SET name=$1, note=$2 WHERE id=$3 RETURNING *`,
      [name, note || null,  id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "المصروف غير موجود", status: false });
    }
    
    return res.status(200).json({ data: result.rows[0], status: true, message: "تم تحديث المصروف بنجاح" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
}

const deleteExpense = async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({ message: "الرجاء توفير معرف المصروف", status: false });
  }
  
  try {
    const result = await pool.query(
      "DELETE FROM expenses WHERE id=$1 RETURNING *",
      [id],
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "المصروف غير موجود", status: false });
    }
    
    res.status(200).json({ message: "تم حذف المصروف بنجاح", status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
}

export { getAllExpenses, getExpense, createExpense, updateExpense, deleteExpense }
