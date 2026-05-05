import { pool } from "../models/db.js"
import { v4 as uuidv4 } from "uuid"

// الصفحه دي لي صاحب السيستيم نفسه يعني انا 
const getGyms = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM gym')
    return res.status(200).json({ data: result.rows || [], status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
}
const createGym = async (req, res) => {
  const { phone, name, isActive } = req.body;
  const logo = req.file?.path || null;

  if (!logo)
    return res.status(400).json({ message: "الرجاء رفع لوجو", status: false });

  if (!phone?.trim())
    return res.status(400).json({ message: "الرجاء إدخال الهاتف", status: false });

  if (!name?.trim())
    return res.status(400).json({ message: "الرجاء إدخال الاسم", status: false });
  
  const now = new Date();

  try {
    await pool.query("BEGIN");
    const result = await pool.query(
      `INSERT INTO gym (
         logo, phone, name, is_active, created_at, updated_at
      ) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [logo, phone, name, isActive, now, now]
    );
    
    if (!result.rows || result.rows.length === 0) {
      await pool.query("ROLLBACK");
      return res.status(500).json({
        message: "فشل إنشاء الجيم، لم يتم حفظ البيانات",
        status: false,
      });
    }

    await pool.query("COMMIT");

    res.status(201).json({
      data: {
        gym: result.rows[0],
      },
      status: true,
      message: "تم إنشاء الجيم بنجاح",
    });

  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("createGym error:", error);
    res.status(500).json({
      message: "حدث خطأ في الخادم",
      status: false,
    });
  }
};
const getGym = async (req, res) => {
  const { id } = req.params; 
  try {
    const result = await pool.query('SELECT * FROM gym WHERE id=$1', [id])
    return res.status(200).json({ data: result.rows[0] || [], status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
}
const deleteGym = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "الرجاء توفير معرف الجيم", status: false });
  }
  try {
    await pool.query("BEGIN");
    const result = await pool.query(
      "DELETE FROM gym WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      await pool.query("ROLLBACK");
      return res.status(404).json({ message: "جيم غير موجود", status: false });
    }
    const branch = await pool.query(
      "DELETE FROM branches WHERE gym_id = $1 RETURNING *",
      [id],
    );
    if (branch.rows.length === 0) {
      await pool.query("ROLLBACK");
      return res.status(404).json({ message: "جيم غير موجود", status: false });
    }

    await pool.query("COMMIT");

    res.status(200).json({ message: "تم حذف الجيم بنجاح", status: true });
  } catch (error) {
    await pool.query("ROLLBACK");
    res.status(500).json({ message: error.message, status: false });
  }
}
const updateGym = async (req, res) => {
  try {
    const { id } = req.params;
    const { phone, name, isActive } = req.body;
    const logo = req.file?.path || null;
    const updatedAt = new Date();
    const data = { id, logo, phone, name, isActive, updatedAt };

    return res.status(200).json({ data: data, status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
}


export { getGyms, getGym, deleteGym, updateGym, createGym }