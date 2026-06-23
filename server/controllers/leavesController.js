import { pool } from "../models/db.js";

const getAllLeaves = async (req, res) => {
  const { branchId } = req.user;
  try {
    if (!branchId) return res.status(400).json({ message: "provide gym id", status: false });
    const result = await pool.query(`SELECT * FROM leaves WHERE branch_id = $1 `, [branchId]);
    return res.status(200).json({ data: result.rows, status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const getLeave = async (req, res) => {
  const { id } = req.params;
  const { branchId } = req.user;
  try {
    if (!branchId) return res.status(400).json({ message: "provide gym id", status: false });
    const result = await pool.query(`SELECT * FROM leaves WHERE id = $1 AND branch_id = $2`, [id, branchId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "الاجازة غير موجودة", status: false });
    }
    return res.status(200).json({ data: result.rows[0], status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const createLeave = async (req, res) => {
  const { branchId } = req.user;
  const { name, days } = req.body;

  try {
    if (!branchId) return res.status(400).json({ message: "provide gym id", status: false });
    if (!name) return res.status(400).json({ message: "الرجاء إدخال اسم الاجازة", status: false });
    if (days === undefined || days === null) return res.status(400).json({ message: "الرجاء إدخال عدد الأيام", status: false });

    const result = await pool.query(
      `INSERT INTO leaves (branch_id, name, days) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [branchId, name, days]
    );

    return res.status(201).json({ data: result.rows[0], status: true, message: "تم إنشاء الاجازة بنجاح" });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const updateLeave = async (req, res) => {
  const { id } = req.params;
  const { branchId } = req.user;
  const { name, days } = req.body;

  try {
    if (!branchId) return res.status(400).json({ message: "provide gym id", status: false });
    if (!name) return res.status(400).json({ message: "الرجاء إدخال اسم الاجازة", status: false });
    if (days === undefined || days === null) return res.status(400).json({ message: "الرجاء إدخال عدد الأيام", status: false });

    const result = await pool.query(
      `UPDATE leaves SET name = $1, days = $2 
       WHERE id = $3 AND branch_id = $4 
       RETURNING *`,
      [name, days, id, branchId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "الاجازة غير موجودة", status: false });
    }

    return res.status(200).json({ data: result.rows[0], status: true, message: "تم تحديث الاجازة بنجاح" });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const deleteLeave = async (req, res) => {
  const { id } = req.params;
  const { branchId } = req.user;

  try {
    if (!branchId) return res.status(400).json({ message: "provide gym id", status: false });
    const result = await pool.query(
      "DELETE FROM leaves WHERE id = $1 AND branch_id = $2 RETURNING *",
      [id, branchId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "الاجازة غير موجودة", status: false });
    }
    return res.status(200).json({ message: "تم حذف الاجازة بنجاح", status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

export { getAllLeaves, getLeave, createLeave, updateLeave, deleteLeave };
