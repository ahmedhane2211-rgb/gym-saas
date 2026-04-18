import { pool } from "../models/db.js";

// 🔥 CREATE
const createSubscribe = async (req, res) => {
    const { memberId, plansId, startDate, endDate } = req.body;
    const client = await pool.connect();

    if (!memberId || !plansId || !startDate || !endDate) {
        return res.status(400).json({ message: "الرجاء ملء جميع الحقول", status: false });
    }

    try {
        await client.query('BEGIN');

        // ✅ check member + نفس الفرع
        const member = await client.query(
            "SELECT id FROM members WHERE id = $1 AND branch_id = $2",
            [memberId, req.user.branchId]
        );

        if (member.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "المستخدم غير موجود", status: false });
        }

        // ✅ check plan (planId) + نفس الفرع
        const plans = await client.query(
            "SELECT id FROM plans WHERE id = $1 AND branch_id = $2",
            [plansId, req.user.branchId]
        );

        if (plans.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "الخطة غير موجودة", status: false });
        }

        // ✅ validate dates
        if (new Date(startDate) >= new Date(endDate)) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: "تاريخ البداية لازم يكون قبل النهاية", status: false });
        }

        // ✅ insert بنفس اسم الجدول والاعمدة
        const result = await client.query(
            `INSERT INTO subscription 
            (member_id, plans_id, start_date, end_date, branch_id) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *`,
            [memberId, subscriptionId, startDate, endDate, req.user.branchId]
        );

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: "فشل إنشاء الاشتراك", status: false });
        }

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
    const { memberId, subscriptionId, startDate, endDate } = req.body;
    const { id } = req.params;
    const client = await pool.connect();

    if (!id) {
        return res.status(400).json({ message: "الرجاء تقديم معرف الاشتراك", status: false });
    }

    if (!memberId || !subscriptionId || !startDate || !endDate) {
        return res.status(400).json({ message: "الرجاء ملء جميع الحقول", status: false });
    }

    try {
        await client.query('BEGIN');

        // ✅ check member
        const member = await client.query(
            "SELECT id FROM members WHERE id = $1 AND branch_id = $2",
            [memberId, req.user.branchId]
        );

        if (member.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "المستخدم غير موجود", status: false });
        }

        // ✅ check plan
        const subscription = await client.query(
            "SELECT id FROM plans WHERE id = $1 AND branch_id = $2",
            [subscriptionId, req.user.branchId]
        );

        if (subscription.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "الخطة غير موجودة", status: false });
        }

        // ✅ validate dates
        if (new Date(startDate) >= new Date(endDate)) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: "تاريخ البداية لازم يكون قبل النهاية", status: false });
        }

        // ✅ update + security
        const result = await client.query(
            `UPDATE subscription 
             SET member_id = $1, plans_id = $2, start_date = $3, end_date = $4 
             WHERE id = $5 AND branch_id = $6
             RETURNING *`,
            [memberId, subscriptionId, startDate, endDate, id, req.user.branchId]
        );

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "الاشتراك غير موجود", status: false });
        }

        await client.query('COMMIT');

        return res.status(200).json({
            data: result.rows[0],
            status: true,
            message: "تم تحديث الاشتراك بنجاح"
        });

    } catch (error) {
        await client.query('ROLLBACK');
        return res.status(500).json({ message: error.message, status: false });
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