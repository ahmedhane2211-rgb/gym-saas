import { pool } from "../models/db.js";
import { v4 as uuidv4 } from "uuid";

// إضافة عضو جديد
export const createMember = async (req, res) => {
  const {
    gymId,
    branchId,
    fullName,
    phone,
    email,
    barcode,
    photoUrl,
    idNumber,
    dateOfBirth,
    gender,
    isActive,
    subscriptionId,
  } = req.body;
  console.log(fullName)
  if (
    !gymId ||
    !branchId ||
    !fullName ||
    !phone ||
    !email ||
    !barcode ||
    !idNumber ||
    !dateOfBirth ||
    !gender ||
    isActive === undefined
  ) {
    return res
      .status(400)
      .json({ message: "الرجاء ملء جميع الحقول", status: false });
  }

  const id = uuidv4();
  const createdAt = new Date();

  try {
    const result = await pool.query(
      `INSERT INTO members (
        id, gymId, branchId, fullName, phone, email, barcode, photoUrl, idNumber, dateOfBirth, gender, isActive, createdAt
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [
        id,
        gymId,
        branchId,
        fullName,
        phone,
        email,
        barcode,
        photoUrl,
        idNumber,
        dateOfBirth,
        gender,
        isActive,
        createdAt,
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
    gymId,
    branchId,
    fullName,
    phone,
    email,
    barcode,
    photoUrl,
    idNumber,
    dateOfBirth,
    gender,
    isActive,
  } = req.body;
  console.log(req.body)
  if (
    !gymId ||
    !branchId ||
    !fullName ||
    !phone ||
    !email ||
    !barcode ||
    !idNumber ||
    !dateOfBirth ||
    !gender ||
    isActive === undefined
  ) {
    return res
      .status(400)
      .json({ message: "الرجاء ملء جميع الحقول", status: false });
  }
  try {
    const result = await pool.query(
      `UPDATE members SET gymId=$1, branchId=$2, fullName=$3, phone=$4, email=$5, barcode=$6, photoUrl=$7, idNumber=$8, dateOfBirth=$9, gender=$10, isActive=$11 WHERE id=$12 RETURNING *`,
      [
        gymId,
        branchId,
        fullName,
        phone,
        email,
        barcode,
        photoUrl,
        idNumber,
        dateOfBirth,
        gender,
        isActive,
        id,
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
