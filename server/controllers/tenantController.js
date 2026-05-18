import { pool } from "../models/db.js";

// جلب جميع اشتراكات الجيم (التينانت) - يعرض مستخدمي الأدمن مع حالة اشتراك الجيم الخاص بهم
const getAllSubscriptions = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                g.id as gym_id,
                g.name as gym_name, 
                g.phone as gym_phone,
                g.is_active as gym_is_active,
                u.id as user_id, 
                u.full_name, 
                u.email, 
                u.phone as user_phone,
                gs.id as subscription_id,
                gs.id as id,
                gs.status, 
                gs.start_date, 
                gs.end_date, 
                gs.is_trial, 
                gs.paid
            FROM gym g
            LEFT JOIN (
                SELECT DISTINCT ON (gym_id) *
                FROM users
                WHERE role = 'admin'
                ORDER BY gym_id, id ASC
            ) u ON g.id = u.gym_id
            LEFT JOIN (
                SELECT DISTINCT ON (gym_id) *
                FROM gym_subscriptions
                ORDER BY gym_id, id DESC
            ) gs ON g.id = gs.gym_id
            ORDER BY g.id DESC
        `);
        const processedRows = result.rows.map(row => ({
            gym_id: row.gym_id,
            gym_name: row.gym_name,
            gym_phone: row.gym_phone,
            gym_is_active: row.gym_is_active,
            subscription_id: row.subscription_id,
            id: row.id,
            status: row.status,
            start_date: row.start_date,
            end_date: row.end_date,
            is_trial: row.is_trial,
            paid: row.paid,
            user: row.user_id ? {
                id: row.user_id,
                full_name: row.full_name,
                email: row.email,
                phone: row.user_phone
            } : null
        }));

        return res.status(200).json(processedRows);
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
};

// إنشاء اشتراك جديد
const createSubscription = async (req, res) => {
    const { gym_id, status, start_date, end_date, is_trial, paid } = req.body;

    if (!gym_id || !status || !start_date || !end_date) {
        return res.status(400).json({ message: "الرجاء توفير جميع الحقول المطلوبة", status: false });
    }

    const gyms = await pool.query("SELECT * FROM gym WHERE id = $1", [gym_id]);
    if (gyms.rowCount === 0) {
        return res.status(404).json({ message: "الجيم غير موجود", status: false });
    }


    try {
        const result = await pool.query(
            "INSERT INTO gym_subscriptions (gym_id, status, start_date, end_date, is_trial, paid) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [gym_id, status, start_date, end_date, is_trial || false, paid || 0]
        );
        return res.status(201).json({ message: "تم إنشاء الاشتراك بنجاح", data: result.rows[0], status: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
};

// جلب اشتراك معين بواسطة المعرف
const getSubscriptionById = async (req, res) => {
    const { id } = req.params;
    if(!id){
        return res.status(400).json({ message: "الرجاء توفير المعرف", status: false });
    }
    try {
        const result = await pool.query(`
            SELECT gs.*, g.name as gym_name 
            FROM gym_subscriptions gs
            LEFT JOIN gym g ON gs.gym_id = g.id
            WHERE gs.id = $1
        `, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "الاشتراك غير موجود", status: false });
        }
        return res.status(200).json({ data: result.rows[0], status: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
};

// تحديث بيانات الاشتراك
const updateSubscription = async (req, res) => {
    const { id } = req.params;
    const { gym_id, status, start_date, end_date, is_trial, paid } = req.body;

    try {
        const result = await pool.query(
            "UPDATE gym_subscriptions SET gym_id=$1, status=$2, start_date=$3, end_date=$4, is_trial=$5, paid=$6 WHERE id = $7 RETURNING *",
            [gym_id, status, start_date, end_date, is_trial, paid, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "الاشتراك غير موجود", status: false });
        }
        return res.status(200).json({ message: "تم تحديث الاشتراك بنجاح", data: result.rows[0], status: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
};

// حذف اشتراك
const deleteSubscription = async (req, res) => {
    const { id } = req.params;
    if(!id){
        return res.status(400).json({ message: "الرجاء توفير المعرف", status: false });
    }
    try {
        const result = await pool.query("DELETE FROM gym_subscriptions WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "الاشتراك غير موجود", status: false });
        }
        return res.status(200).json({ message: "تم حذف الاشتراك بنجاح", status: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
};

export {
    getAllSubscriptions,
    createSubscription,
    getSubscriptionById,
    updateSubscription,
    deleteSubscription
};
