import { pool } from "../models/db.js";

const calculateRemainingDays = async (employeeId, leavesId, excludeId = null) => {
  const leaveResult = await pool.query(
    "SELECT days FROM leaves WHERE id = $1",
    [leavesId]
  );
  if (leaveResult.rows.length === 0) return 0;
  const totalDays = leaveResult.rows[0].days;

  let query = "SELECT SUM(requested_days) as taken FROM leaves_permission WHERE employee_id = $1 AND leaves_id = $2 AND status = 'approved'";
  let params = [employeeId, leavesId];
  if (excludeId) {
    query += " AND id != $3";
    params.push(excludeId);
  }

  const takenResult = await pool.query(query, params);
  const takenDays = parseInt(takenResult.rows[0].taken || 0, 10);
  return totalDays - takenDays;
};

const fetchFullLeavePermission = async (id) => {
  const result = await pool.query(
    `SELECT lp.*,
            json_build_object(
              'id', e.id,
              'name', e.name,
              'branch_id', e.branch_id,
              'user', json_build_object(
                'id', u.id,
                'full_name', u.full_name,
                'email', u.email,
                'phone', u.phone
              )
            ) as employee,
            json_build_object(
              'id', l.id,
              'name', l.name,
              'days', l.days
            ) as leave
     FROM leaves_permission lp
     JOIN employees e ON lp.employee_id = e.id
     JOIN users u ON e.user_id = u.id
     JOIN leaves l ON lp.leaves_id = l.id
     WHERE lp.id = $1`,
    [id]
  );
  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  const remaining = await calculateRemainingDays(row.employee_id, row.leaves_id);
  return {
    ...row,
    remaining_days: remaining
  };
};

const getAllLeavesPermissions = async (req, res) => {
  const { branchId } = req.user;
  try {
    const result = await pool.query(
      `SELECT lp.*,
              json_build_object(
                'id', e.id,
                'name', e.name,
                'branch_id', e.branch_id,
                'user', json_build_object(
                  'id', u.id,
                  'full_name', u.full_name,
                  'email', u.email,
                  'phone', u.phone
                )
              ) as employee,
              json_build_object(
                'id', l.id,
                'name', l.name,
                'days', l.days
              ) as leave
       FROM leaves_permission lp
       JOIN employees e ON lp.employee_id = e.id
       JOIN users u ON e.user_id = u.id
       JOIN leaves l ON lp.leaves_id = l.id
       WHERE lp.branch_id = $1
       ORDER BY lp.created_at DESC`,
      [branchId]
    );

    const data = [];
    for (const row of result.rows) {
      const remaining = await calculateRemainingDays(row.employee_id, row.leaves_id);
      data.push({
        ...row,
        remaining_days: remaining
      });
    }

    return res.status(200).json({ data, status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const getLeavePermission = async (req, res) => {
  const { id } = req.params;
  try {
    const fullData = await fetchFullLeavePermission(id);
    if (!fullData) {
      return res.status(404).json({ message: "طلب الإجازة غير موجود", status: false });
    }
    return res.status(200).json({ data: fullData, status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const createLeavePermission = async (req, res) => {
  const { branchId } = req.user;
  const { employee_id, leaves_id, from_date, to_date, from_time, to_time, requested_minutes } = req.body;

  try {
    if (!employee_id || !leaves_id || !from_date || !to_date) {
      return res.status(400).json({ message: "الرجاء ملء جميع الحقول المطلوبة", status: false });
    }

    const start = new Date(from_date);
    const end = new Date(to_date);
    const diffTime = end - start;
    if (diffTime < 0) {
      return res.status(400).json({ message: "تاريخ البداية يجب أن يكون قبل تاريخ النهاية", status: false });
    }
    const requested_days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const remaining = await calculateRemainingDays(employee_id, leaves_id);

    if (requested_days > remaining) {
      return res.status(400).json({
        message: `عدد الأيام المطلوبة (${requested_days}) أكبر من الأيام المتبقية المسموح بها (${remaining})`,
        status: false
      });
    }

    const pendingCheck = await pool.query(
      "SELECT id FROM leaves_permission WHERE employee_id = $1 AND status = 'pending'",
      [employee_id]
    );
    if (pendingCheck.rows.length > 0) {
      return res.status(400).json({
        message: "يوجد طلب إجازة معلق بالفعل لهذا الموظف",
        status: false
      });
    }

    const result = await pool.query(
      `INSERT INTO leaves_permission (
        employee_id, leaves_id, from_date, to_date, from_time, to_time, 
        requested_days, requested_minutes, status, branch_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9) RETURNING *`,
      [employee_id, leaves_id, from_date, to_date, from_time || null, to_time || null, requested_days, requested_minutes || null, branchId]
    );

    const newRow = result.rows[0];
    const fullData = await fetchFullLeavePermission(newRow.id);

    return res.status(201).json({
      data: fullData,
      status: true,
      message: "تم تقديم طلب الإجازة بنجاح"
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const updateLeavePermission = async (req, res) => {
  const { id } = req.params;
  const { employee_id, leaves_id, from_date, to_date, from_time, to_time, requested_minutes } = req.body;

  try {
    const checkStatus = await pool.query("SELECT status FROM leaves_permission WHERE id = $1", [id]);
    if (checkStatus.rows.length === 0) {
      return res.status(404).json({ message: "طلب الإجازة غير موجود", status: false });
    }
    if (checkStatus.rows[0].status !== 'pending') {
      return res.status(400).json({ message: "لا يمكن تعديل طلب إجازة تم قبوله أو رفضه", status: false });
    }

    if (!employee_id || !leaves_id || !from_date || !to_date) {
      return res.status(400).json({ message: "الرجاء ملء جميع الحقول المطلوبة", status: false });
    }

    const start = new Date(from_date);
    const end = new Date(to_date);
    const diffTime = end - start;
    if (diffTime < 0) {
      return res.status(400).json({ message: "تاريخ البداية يجب أن يكون قبل تاريخ النهاية", status: false });
    }
    const requested_days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const remaining = await calculateRemainingDays(employee_id, leaves_id, id);

    if (requested_days > remaining) {
      return res.status(400).json({
        message: `عدد الأيام المطلوبة (${requested_days}) أكبر من الأيام المتبقية المسموح بها (${remaining})`,
        status: false
      });
    }

    const result = await pool.query(
      `UPDATE leaves_permission SET 
        employee_id = $1, leaves_id = $2, from_date = $3, to_date = $4, 
        from_time = $5, to_time = $6, requested_days = $7, requested_minutes = $8
       WHERE id = $9 RETURNING *`,
      [employee_id, leaves_id, from_date, to_date, from_time || null, to_time || null, requested_days, requested_minutes || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "طلب الإجازة غير موجود", status: false });
    }

    const updatedRow = result.rows[0];
    const fullData = await fetchFullLeavePermission(updatedRow.id);

    return res.status(200).json({
      data: fullData,
      status: true,
      message: "تم تحديث طلب الإجازة بنجاح"
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const deleteLeavePermission = async (req, res) => {
  const { id } = req.params;
  try {
    const checkStatus = await pool.query("SELECT status FROM leaves_permission WHERE id = $1", [id]);
    if (checkStatus.rows.length === 0) {
      return res.status(404).json({ message: "طلب الإجازة غير موجود", status: false });
    }
    if (checkStatus.rows[0].status !== 'pending') {
      return res.status(400).json({ message: "لا يمكن حذف طلب إجازة تم قبوله أو رفضه", status: false });
    }

    const result = await pool.query("DELETE FROM leaves_permission WHERE id = $1 RETURNING *", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "طلب الإجازة غير موجود", status: false });
    }
    return res.status(200).json({ message: "تم حذف طلب الإجازة بنجاح", status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const approveLeavePermission = async (req, res) => {
  const { id } = req.params;
  try {
    const checkResult = await pool.query("SELECT * FROM leaves_permission WHERE id = $1", [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "طلب الإجازة غير موجود", status: false });
    }

    const { employee_id, leaves_id, requested_days } = checkResult.rows[0];
    const remaining = await calculateRemainingDays(employee_id, leaves_id, id);

    if (requested_days > remaining) {
      return res.status(400).json({
        message: `لا يمكن قبول الطلب لأن الأيام المطلوبة (${requested_days}) تتجاوز الرصيد المتبقي (${remaining})`,
        status: false
      });
    }

    const result = await pool.query(
      "UPDATE leaves_permission SET status = 'approved' WHERE id = $1 RETURNING *",
      [id]
    );

    const updatedRow = result.rows[0];
    const fullData = await fetchFullLeavePermission(updatedRow.id);

    return res.status(200).json({
      data: fullData,
      status: true,
      message: "تم قبول طلب الإجازة"
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const rejectLeavePermission = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE leaves_permission SET status = 'rejected' WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "طلب الإجازة غير موجود", status: false });
    }

    const updatedRow = result.rows[0];
    const fullData = await fetchFullLeavePermission(updatedRow.id);

    return res.status(200).json({
      data: fullData,
      status: true,
      message: "تم رفض طلب الإجازة"
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

export {
  getAllLeavesPermissions,
  getLeavePermission,
  createLeavePermission,
  updateLeavePermission,
  deleteLeavePermission,
  approveLeavePermission,
  rejectLeavePermission
};
