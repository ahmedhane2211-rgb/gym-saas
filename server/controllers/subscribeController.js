import { pool } from "../models/db.js";

// 🔥 CREATE
const createSubscribe = async (req, res) => {
  const { memberId, plansId, startDate, endDate } = req.body;
  const client = await pool.connect();

  if (!memberId || !plansId || !startDate || !endDate) {
    return res.status(400).json({
      message: "الرجاء ملء جميع الحقول",
      status: false
    });
  }

  try {
    await client.query('BEGIN');

    // ✅ Lock branch to prevent race conditions in cash report
    await client.query('SELECT 1 FROM branches WHERE id = $1 FOR UPDATE', [req.user.branchId]);

    const member = await client.query(
      "SELECT id FROM members WHERE id = $1 AND branch_id = $2",
      [memberId, req.user.branchId]
    );
    if (member.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: "المستخدم غير موجود", status: false });
    }

    const plans = await client.query(
      "SELECT id, price FROM plans WHERE id = $1 AND branch_id = $2",
      [plansId, req.user.branchId]
    );
    if (plans.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: "الخطة غير موجودة", status: false });
    }

    const price = Number(plans.rows[0].price);

    const activeSub = await client.query(
      `SELECT 1 FROM subscription 
       WHERE member_id = $1 AND branch_id = $2 
       AND end_date >= NOW() AND status = 'active'`,
      [memberId, req.user.branchId]
    );
    if (activeSub.rowCount > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: "العضو لديه اشتراك ساري بالفعل", status: false });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: "تاريخ البداية لازم يكون قبل النهاية", status: false });
    }

    const result = await client.query(
      `INSERT INTO subscription 
       (member_id, plans_id, start_date, end_date, branch_id, paid, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [memberId, plansId, startDate, endDate, req.user.branchId, price, 'active']
    );

    // ✅ FIX 1: جيب آخر صف بـ ORDER BY + LIMIT
    const cashDay = await client.query(
      `SELECT total_value FROM cash_report 
       WHERE branch_id = $1 
       ORDER BY created_at DESC, id DESC LIMIT 1`,
      [req.user.branchId]
    );

    // ✅ FIX 2: لو الجدول فاضي ابدأ من 0 مش ترجع error
    const total_value = cashDay.rowCount > 0
      ? Number(cashDay.rows[0].total_value)
      : 0;

    await client.query(
      `INSERT INTO cash_report (type, value, total_value, branch_id, created_at) 
       VALUES ($1, $2, $3, $4, NOW())`,
      ['اشتراك عضو', price, price + total_value, req.user.branchId]
    );

    await client.query('COMMIT');

    return res.status(201).json({
      data: result.rows[0],
      status: true,
      message: "تم إنشاء الاشتراك بنجاح"
    });

  } catch (error) {
    await client.query('ROLLBACK');
    return res.status(500).json({ message: error.message, status: false });
  } finally {
    client.release();
  }
};


// 🔥 UPDATE
const updateSubscribe = async (req, res) => {
  const { memberId, plansId, startDate, endDate } = req.body;
  const { id } = req.params;
  const client = await pool.connect();

  if (!id) {
    return res.status(400).json({
      message: "الرجاء تقديم معرف الاشتراك",
      status: false
    });
  }

  if (!memberId || !plansId || !startDate || !endDate) {
    return res.status(400).json({
      message: "الرجاء ملء جميع الحقول",
      status: false
    });
  }

  try {
    await client.query('BEGIN');

    // ✅ Lock branch to prevent race conditions in cash report
    await client.query('SELECT 1 FROM branches WHERE id = $1 FOR UPDATE', [req.user.branchId]);

    // ✅ check member
    const member = await client.query(
      `SELECT id FROM members WHERE id = $1 AND branch_id = $2`,
      [memberId, req.user.branchId]
    );

    if (member.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        message: "المستخدم غير موجود",
        status: false
      });
    }

    // ✅ check old subscription
    const oldSub = await client.query(
      `SELECT plans_id, paid 
       FROM subscription 
       WHERE id = $1 AND branch_id = $2`,
      [id, req.user.branchId]
    );

    if (oldSub.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        message: "الاشتراك غير موجود",
        status: false
      });
    }

    // ✅ check new plan
    const plan = await client.query(
      `SELECT price FROM plans WHERE id = $1 AND branch_id = $2`,
      [plansId, req.user.branchId]
    );

    if (plan.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        message: "الخطة غير موجودة",
        status: false
      });
    }

    const newPrice = Number(plan.rows[0].price);
    const oldPaid = Number(oldSub.rows[0].paid);

    // ✅ validate dates
    if (new Date(startDate) >= new Date(endDate)) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        message: "تاريخ البداية لازم يكون قبل النهاية",
        status: false
      });
    }

    // ✅ حساب الفرق
    const diff = newPrice - oldPaid;

    // 🔥 الحل الصح: احسب التوتال من كل الداتا
    if (diff !== 0) {
      const totalRes = await client.query(
        `SELECT COALESCE(SUM(value), 0) AS total
         FROM cash_report
         WHERE branch_id = $1`,
        [req.user.branchId]
      );

      const prevTotal = Number(totalRes.rows[0].total);
      const newTotal = prevTotal + diff;

      const type = diff > 0
        ? 'تعديل اشتراك (زيادة)'
        : 'تعديل اشتراك (استرجاع)';

      await client.query(
        `INSERT INTO cash_report 
         (type, value, total_value, branch_id) 
         VALUES ($1, $2, $3, $4)`,
        [type, diff, newTotal, req.user.branchId]
      );
    }

    // ✅ update subscription
    const result = await client.query(
      `UPDATE subscription 
       SET member_id = $1,
           plans_id = $2,
           start_date = $3,
           end_date = $4,
           paid = $5
       WHERE id = $6 AND branch_id = $7
       RETURNING *`,
      [memberId, plansId, startDate, endDate, newPrice, id, req.user.branchId]
    );

    await client.query('COMMIT');

    return res.status(200).json({
      data: result.rows[0],
      status: true,
      message: "تم تحديث الاشتراك بنجاح"
    });

  } catch (error) {
    await client.query('ROLLBACK');
    return res.status(500).json({
      message: error.message,
      status: false
    });
  } finally {
    client.release();
  }
};

// 🔥 DELETE
const deleteSubscribe = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();

  if (!id) {
    return res.status(400).json({ message: "الرجاء ملء جميع الحقول", status: false });
  }

  try {
    await client.query('BEGIN');

    const result = await client.query(
      `DELETE FROM subscription 
             WHERE id = $1 AND branch_id = $2 
             RETURNING *`,
      [id, req.user.branchId]
    );

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: "الاشتراك غير موجود", status: false });
    }

    await client.query('COMMIT');

    return res.status(200).json({
      data: result.rows[0],
      status: true,
      message: "تم حذف الاشتراك بنجاح"
    });

  } catch (error) {
    await client.query('ROLLBACK');
    return res.status(500).json({ message: error.message, status: false });
  } finally {
    client.release();
  }
};


// 🔥 GET
const getSubscribes = async (req, res) => {
  try {

    const result = await pool.query(
      "SELECT * FROM subscription WHERE branch_id = $1",
      [req.user.branchId]
    );

    return res.status(200).json({
      data: result.rows,
      status: true
    });

  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

export { createSubscribe, getSubscribes, updateSubscribe, deleteSubscribe };