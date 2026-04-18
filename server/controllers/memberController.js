import { pool } from "../models/db.js";

// إضافة عضو جديد
export const createMember = async (req, res) => {
  const { user } = req;
  const branchId = user.branchId;
  const {
    userId,
    qrCode,
    idNumber,
  } = req.body;
  if (

    !userId ||
    !qrCode ||
    !idNumber
  ) {
    return res
      .status(400)
      .json({ message: "الرجاء ملء جميع الحقول", status: false });
  }
  const createdAt = new Date();
  const updatedAt = new Date();

  try {
    await pool.query('BEGIN')
    const users = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
    if (users.rows.length === 0) {
      await pool.query('ROLLBACK')
      return res.status(404).json({ message: "المستخدم غير موجود", status: false });
    }
    const existingMember = await pool.query("SELECT * FROM members WHERE user_id = $1", [userId]);
    if (existingMember.rows.length > 0) {
      await pool.query('ROLLBACK')
      return res.status(400).json({ message: "المستخدم موجود بالفعل", status: false });
    }
    const result = await pool.query(
      `INSERT INTO members (
      qr_code, id_number, user_id,created_at,updated_at,branch_id
      ) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [
        qrCode,
        idNumber,
        userId,
        createdAt,
        updatedAt,
        branchId
      ],
    );
    if (result.rows.length === 0) {
      await pool.query('ROLLBACK')
      return res
        .status(400)
        .json({ message: "فشل إنشاء العضو", status: false });
    }
    await pool.query('COMMIT')
    res.status(201).json({ data: result.rows[0], status: true, message: "تم إنشاء العضو بنجاح" });
  } catch (error) {
    await pool.query('ROLLBACK')
    res.status(500).json({ message: error.message, status: false });
  }
};

// جلب كل الأعضاء
export const getAllMembers = async (req, res) => {
  const { user } = req;
  const branchId = user.branchId
  try {
    const result = await pool.query(
      `SELECT members.*,
  json_build_object(
        'id', users.id,
        'full_name', users.full_name,
        'email', users.email,
        'phone', users.phone,
        'role', users.role,
        'created_at', users.created_at,
        'is_active', users.is_active,
        'gender', users.gender
      ) AS user
   FROM members
   JOIN users ON members.user_id = users.id
   WHERE members.branch_id = $1`,
      [branchId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "لا يوجد أعضاء", status: false });
    }

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
  const { gymId } = req.user;
  if (!id) {
    return res
      .status(400)
      .json({ message: "الرجاء توفير معرف العضو", status: false });
  }
  const {
    userId,
    branchId,
    qrCode,
    idNumber,
  } = req.body;
  if (
    !userId ||
    !qrCode ||
    !idNumber
  ) {
    return res
      .status(400)
      .json({ message: "الرجاء ملء جميع الحقول", status: false });
  }
  try {
    const existingMember = await pool.query("SELECT * FROM members WHERE userId = $1 AND id != $2", [userId, id]);
    if (existingMember.rows.length > 0) {
      return res.status(400).json({ message: "المستخدم موجود بالفعل", status: false });
    }
    const result = await pool.query(
      `UPDATE members SET userId=$1, qr_code=$2, id_number=$3,branch_id=$4 WHERE id=$5 RETURNING *`,
      [
        userId,
        qrCode,
        idNumber,
        branchId || null,
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
  const { gymId } = req.user;
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
