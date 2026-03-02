import { pool } from "../models/db.js"
import { v4 as uuidv4 } from "uuid";

const getSubscriptions = async (req, res) => {
  const { gym_id } = req.query;
  try {
    let query = 'SELECT * FROM subscription_plans';
    let params = [];
    if (gym_id) {
      query += ' WHERE gym_id = $1';
      params.push(gym_id);
    }
    const result = await pool.query(query, params)
    return res.status(200).json({ data: result.rows || [], status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
}
const createSubscription = async (req, res) => {
  const {
    duration,
    name,
    price,
    isActive,
    description,
    gym_id
  } = req.body;

  if (!duration) return res.status(400).json({ message: "حقل المدة (duration) مطلوب", status: false });
  if (!name) return res.status(400).json({ message: "حقل الاسم (name) مطلوب", status: false });
  if (!price) return res.status(400).json({ message: "حقل السعر (price) مطلوب", status: false });
  if (isActive === undefined) return res.status(400).json({ message: "حقل الحالة (isActive) مطلوب", status: false });
  if (!description) return res.status(400).json({ message: "حقل الوصف (description) مطلوب", status: false });
  if (!gym_id) return res.status(400).json({ message: "حقل معرف الجيم (gym_id) مطلوب", status: false });

  const id = uuidv4();
  const createdAt = new Date();
  const updatedAt = new Date();

  try {
    const result = await pool.query(
      `INSERT INTO subscription_plans (
        id, duration, name, price, is_active, description, gym_id, created_At, updated_At
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        id,
        duration,
        name,
        price,
        isActive,
        description,
        gym_id,
        createdAt,
        updatedAt
      ],
    );
    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ message: "فشل إنشاء الاشتراك", status: false });
    }
    res.status(201).json({ data: result.rows[0], status: true, message: "تم إنشاء الاشتراك بنجاح" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
}
const getSubscription = async (req, res) => {
  const { id } = req.params; // تمت إزالة الأقواس من params
  try {
    const result = await pool.query('SELECT * FROM subscription_plans WHERE id=$1', [id])
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "اشتراك غير موجود", status: false })
    }
    return res.status(200).json({ data: result.rows[0] || [], status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
}
const deleteSubscription = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "الرجاء توفير معرف العضو", status: false });
  }
  try {
    const result = await pool.query(
      "DELETE FROM subscription_plans WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "عضو غير موجود", status: false });
    }
    res.status(200).json({ message: "تم حذف العضو بنجاح", status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
}
const updateSubscription = async (req, res) => {
  try {

  } catch (error) {

  }
}


export { getSubscriptions, getSubscription, deleteSubscription, updateSubscription, createSubscription }