import { pool } from "../models/db.js"
import { v4 as uuidv4 } from "uuid"

const getAllBranches = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM branches')
    return res.status(200).json({ data: result.rows || [], status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
}
const createBranch = async (req, res) => {
  const {
    address,
    gym_id,
    phone,
    name,
    isActive,
  } = req.body;

  if (!address) {
    return res
      .status(400)
      .json({ message: "الرجاء ملء جميع الحقول (العنوان)", status: false });
  }
  if (!gym_id) {
    return res
      .status(400)
      .json({ message: "الرجاء ملء جميع الحقول (الجيم)", status: false });
  }
  if (!phone) {
    return res
      .status(400)
      .json({ message: "الرجاء ملء جميع الحقول (هاتف)", status: false });
  }
  if (!name) {
    return res
      .status(400)
      .json({ message: "الرجاء ملء جميع الحقول (اسم)", status: false });
  }
  if (isActive === undefined) {
    return res
      .status(400)
      .json({ message: "الرجاء ملء جميع الحقول (الحالة)", status: false });
  }

  const id = uuidv4();
  const createdAt = new Date();
  const updatedAt = new Date();

  try {
      const isGymExist = await pool.query(
        `SELECT * FROM gym WHERE id = $1`,[gym_id]
      );
      if (isGymExist.rows.length === 0) {
        return res
          .status(400)
          .json({ message: "لا يوجد جيم بهذا المعرف", status: false });
      }
      const result = await pool.query(
        `INSERT INTO branches (
          id,phone,address,gym_id,name,isActive,created_at,updated_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
        [id, phone,address,gym_id, name, isActive, createdAt, updatedAt],
      );
      if (result.rows.length === 0) {
        return res
          .status(400)
          .json({ message: "تم إنشاء الفرع بنجاح", status: false });
      }
    
    res.status(201).json({ data: result.rows[0], status: true, message: "تم إنشاء الجيم بنجاح" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
}
const getBranch = async (req, res) => {
  const { id } = req.params; // تمت إزالة الأقواس من params
  try {
    const result = await pool.query('SELECT * FROM branches WHERE id=$1', [id])
    return res.status(200).json({ data: result.rows[0] || [], status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
}
const deleteBranch = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "الرجاء توفير معرف الجيم", status: false });
  }
  try {
    const result = await pool.query(
      "DELETE FROM branches WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "جيم غير موجود", status: false });
    }
    res.status(200).json({ message: "تم حذف الجيم بنجاح", status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
}
const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const { phone, name, isActive } = req.body;
    const updatedAt = new Date();
    const data = { id,  phone, name, isActive, updatedAt };

    return res.status(200).json({ data: data, status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
}


export { getAllBranches, getBranch, deleteBranch, updateBranch, createBranch }