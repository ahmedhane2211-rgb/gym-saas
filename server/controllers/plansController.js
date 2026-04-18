import { pool } from "../models/db.js"

// 🔥 GET ALL
const getPlans = async (req, res) => {
  const { branchId } = req.user;

  if (!branchId) {
    return res.status(400).json({ message: "غير مصرح لك", status: false });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM plans WHERE branch_id = $1",
      [branchId]
    );

    return res.status(200).json({
      data: result.rows,
      status: true
    });

  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};


// 🔥 CREATE
const createPlan = async (req, res) => {
  const { duration, name, price, isActive, description } = req.body;
  const gym_id = req.user?.gymId;
  const branch_id = req.user?.branchId;

  if (duration === undefined || duration === null)
    return res.status(400).json({ message: "حقل المدة مطلوب", status: false });

  if (!name || name.trim() === "")
    return res.status(400).json({ message: "حقل الاسم مطلوب", status: false });

  if (price === undefined || price === null)
    return res.status(400).json({ message: "حقل السعر مطلوب", status: false });

  if (isActive === undefined)
    return res.status(400).json({ message: "حقل الحالة مطلوب", status: false });

  if (!description || description.trim() === "")
    return res.status(400).json({ message: "حقل الوصف مطلوب", status: false });

  if (!gym_id)
    return res.status(400).json({ message: "غير مصرح لك", status: false });

  try {
    // ✅ منع تكرار الاسم داخل نفس الجيم
    const existingPlan = await pool.query(
      "SELECT id FROM plans WHERE name = $1 AND gym_id = $2",
      [name, gym_id]
    );

    if (existingPlan.rows.length > 0) {
      return res.status(400).json({
        message: "يوجد خطة بنفس الاسم",
        status: false
      });
    }

    const result = await pool.query(
      `INSERT INTO plans 
      ( duration, name, price, is_active, description, gym_id,branch_id) 
      VALUES ($1,$2,$3,$4,$5,$6,$7) 
      RETURNING *`,
      [ duration, name, price, isActive, description, gym_id,branch_id]
    );

    return res.status(201).json({
      data: result.rows[0],
      status: true,
      message: "تم إنشاء الاشتراك بنجاح"
    });

  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};


// 🔥 GET ONE
const getPlan = async (req, res) => {
  const { id } = req.params;
  const { gymId } = req.user;

  try {
    const result = await pool.query(
      "SELECT * FROM plans WHERE id = $1 AND gym_id = $2",
      [id, gymId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "اشتراك غير موجود", status: false });
    }

    return res.status(200).json({
      data: result.rows[0],
      status: true
    });

  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};


// 🔥 DELETE
const deletePlan = async (req, res) => {
  const { id } = req.params;
  const { gymId } = req.user;

  if (!id) {
    return res.status(400).json({ message: "الرجاء توفير ID", status: false });
  }

  try {
    const result = await pool.query(
      "DELETE FROM plans WHERE id = $1 AND gym_id = $2 RETURNING *",
      [id, gymId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "الخطة غير موجودة", status: false });
    }

    return res.status(200).json({
      message: "تم حذف الاشتراك بنجاح",
      status: true
    });

  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};


// 🔥 UPDATE
const updatePlans = async (req, res) => {
  const { id } = req.params;
  const { gymId } = req.user;

  const { duration, name, price, isActive, description } = req.body;

  if (!id)
    return res.status(400).json({ message: "الرجاء توفير ID", status: false });

  if (duration === undefined)
    return res.status(400).json({ message: "حقل المدة مطلوب", status: false });

  if (!name)
    return res.status(400).json({ message: "حقل الاسم مطلوب", status: false });

  if (price === undefined)
    return res.status(400).json({ message: "حقل السعر مطلوب", status: false });

  if (isActive === undefined)
    return res.status(400).json({ message: "حقل الحالة مطلوب", status: false });

  if (!description)
    return res.status(400).json({ message: "حقل الوصف مطلوب", status: false });

  try {
    const result = await pool.query(
      `UPDATE plans 
       SET duration=$1, name=$2, price=$3, is_active=$4, description=$5 
       WHERE id=$6 AND gym_id=$7 
       RETURNING *`,
      [duration, name, price, isActive, description, id, gymId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "الخطة غير موجودة", status: false });
    }

    return res.status(200).json({
      data: result.rows[0],
      status: true,
      message: "تم تحديث الاشتراك بنجاح"
    });

  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};


export { getPlans, getPlan, deletePlan, updatePlans, createPlan };