import { pool } from "../models/db.js";
import { v4 as uuidv4 } from "uuid";

// إضافة عضو جديد
export const createMember = async (req, res) => {
  const {
    userId,
    subscriptionId,
    barcode,
    branchId,
    idNumber,
  } = req.body;
  console.log(req.body)
  if (
    
    !userId ||
    !subscriptionId ||
    !barcode ||
    !idNumber || !branchId
  ) {
    return res
      .status(400)
      .json({ message: "الرجاء ملء جميع الحقول", status: false });
  }

  const id = uuidv4();
  const createdAt = new Date();
  const updatedAt = new Date();

  try {
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "المستخدم غير موجود", status: false });
    }
    const result = await pool.query(
      `INSERT INTO members (
        id, barcode, idNumber, userId, subscription_Id, createdAt,updatedAt,branch_id
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [
        id,
        barcode,
        idNumber,
        userId,
        subscriptionId,
        createdAt,
        updatedAt,
        branchId
      ],
    );
    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ message: "فشل إنشاء العضو", status: false });
    }
    res.status(201).json({ data: result.rows[0], status: true, message: "تم إنشاء العضو بنجاح" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

// جلب كل الأعضاء
export const getAllMembers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM members");
    
    res.status(200).json({ data: result.rows || [], status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

// جلب عضو واحد
export const getMemberById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .json({ message: "الرجاء توفير معرف العضو", status: false });
  }
  try {
    const result = await pool.query("SELECT * FROM members WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "عضو غير موجود", status: false });
    }
    res.status(200).json({ data: result.rows[0], status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

// تحديث بيانات عضو
export const updateMember = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .json({ message: "الرجاء توفير معرف العضو", status: false });
  }
  const {
    userId,
    subscriptionId,
    branchId,
    barcode,
    idNumber,
  } = req.body;
  if (
    !userId ||
    !subscriptionId ||
    !barcode ||
    !idNumber || !branchId
  ) {
    return res
      .status(400)
      .json({ message: "الرجاء ملء جميع الحقول", status: false });
  }
  try {
    const result = await pool.query(
      `UPDATE members SET userId=$1, subscription_Id=$2, barcode=$3, idNumber=$4,branch_id=$5 WHERE id=$6 RETURNING *`,
      [
        userId,
        subscriptionId,
        barcode,
        idNumber,
        branchId,
        id
      ],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "عضو غير موجود", status: false });
    }
    res.status(200).json({ data: result.rows[0], status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

// حذف عضو
export const deleteMember = async (req, res) => {
  const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "الرجاء توفير معرف العضو", status: false });
    }
  try {
    const result = await pool.query(
      "DELETE FROM members WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "عضو غير موجود", status: false });
    }
    res.status(200).json({ message: "تم حذف العضو بنجاح", status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};
