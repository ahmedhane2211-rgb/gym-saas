import { pool } from "../models/db.js";

// إضافة عضو جديد
export const createMember = async (req, res) => {
  const { user } = req;
  const branchId = user.branchId;
  const {
    userId,
    idNumber,
  } = req.body;
  if (

    !userId ||
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
      id_number, user_id,created_at,updated_at,branch_id
      ) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [
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
    await pool.query(
  `UPDATE subscription
   SET status = 'inactive'
      WHERE branch_id = $1
      AND status = 'active'
      AND end_date < CURRENT_DATE`,
      [req.user.branchId]
    );

    await pool.query(
  `UPDATE subscription s
   SET status = 'freezed'
   WHERE s.branch_id = $1
     AND s.status = 'active'
     AND EXISTS (
       SELECT 1 FROM subscription_pause sp
       WHERE sp.subscription_id = s.id
         AND sp.status = 'active'
     )`,
      [req.user.branchId]
    );

    await pool.query(
  `UPDATE subscription s
   SET status = 'active'
   WHERE s.branch_id = $1
     AND s.status = 'freezed'
     AND NOT EXISTS (
       SELECT 1 FROM subscription_pause sp
       WHERE sp.subscription_id = s.id
         AND sp.status = 'active'
     )
     AND s.end_date >= CURRENT_DATE`,
      [req.user.branchId]
    );

    const result = await pool.query(
  `SELECT 
    m.*,

    json_build_object(
      'id', u.id,
      'full_name', u.full_name,
      'email', u.email,
      'phone', u.phone,
      'role', u.role,
      'created_at', u.created_at,
      'is_active', u.is_active,
      'gender', u.gender
    ) AS user,

    json_build_object(
      'id', s.id,
      'start_date', s.start_date,
      'end_date', s.end_date,
      'status', CASE
        WHEN EXISTS (
          SELECT 1 FROM subscription_pause sp2
          WHERE sp2.subscription_id = s.id AND sp2.status = 'active'
        ) THEN 'freezed'
        ELSE s.status
      END,
      'plan_id', s.plans_id,

      'features',
      COALESCE(
        json_agg(
          json_build_object(
            'id', sf.id,
            'featuresplan_id', sf.featuresplan_id,
            'used', sf.used,
            'total', sf.total,

            'feature',
            json_build_object(
              'id', f.id,
              'name', f.name
            )
          )
        ) FILTER (WHERE sf.id IS NOT NULL),
        '[]'
      )
    ) AS subscription,

    (
      SELECT json_build_object(
        'id', sp.id,
        'from_date', sp.from_date,
        'to_date', sp.to_date,
        'days', fp.days,
        'status', sp.status,
        'max_uses', fp.max_uses
      )
      FROM subscription_pause sp
      JOIN freeze_plan fp ON fp.id = sp.freeze_id
      WHERE sp.subscription_id = s.id
      ORDER BY sp.from_date DESC
      LIMIT 1
    ) AS subscription_pause

  FROM members m
  JOIN users u ON m.user_id = u.id
 LEFT JOIN LATERAL (
    SELECT * FROM subscription
    WHERE member_id = m.id
    ORDER BY start_date DESC
    LIMIT 1
  ) s ON true

  LEFT JOIN subscription_features sf 
    ON sf.subscription_id = s.id

  LEFT JOIN features_plan fp 
    ON sf.featuresplan_id = fp.id

  LEFT JOIN features f 
    ON fp.features_id = f.id

  WHERE m.branch_id = $1
  GROUP BY m.id, u.id, s.id, s.start_date, s.end_date,s.status, s.plans_id`,
  [branchId]
);
    return res.status(200).json({ data: result.rows || [], status: true });
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
  const { branchId } = req.user;
  if (!id) {
    return res
      .status(400)
      .json({ message: "الرجاء توفير معرف العضو", status: false });
  }
  const {
    userId,
    idNumber,
  } = req.body;
  if (
    !userId ||
    !idNumber
  ) {
    return res
      .status(400)
      .json({ message: "الرجاء ملء جميع الحقول", status: false });
  }
  try {
    const existingMember = await pool.query("SELECT * FROM members WHERE user_id = $1 AND id != $2", [userId, id]);
    if (existingMember.rows.length > 0) {
      return res.status(400).json({ message: "المستخدم موجود بالفعل", status: false });
    }
    const result = await pool.query(
      `UPDATE members SET user_id=$1, id_number=$2,branch_id=$3 WHERE id=$4 RETURNING *`,
      [
        userId,
        idNumber,
        branchId,
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
  const { branchId } = req.user;
  if (!id) {
    return res.status(400).json({ message: "الرجاء توفير معرف العضو", status: false });
  }
  try {
    const result = await pool.query(
      "DELETE FROM members WHERE id = $1 AND branch_id=$2 RETURNING *",
      [id, branchId],
    );
    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Not found or not authorized",
        status: false
      });
    }
    res.status(200).json({ message: "تم حذف العضو بنجاح", status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};
