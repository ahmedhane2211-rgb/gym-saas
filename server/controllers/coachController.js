import { pool } from "../models/db.js";
import { v4 as uuidv4 } from "uuid";


const createCoach = async (req, res) => {
    const { user } = req;
    const { userId, speciality, salary } = req.body;
    if (!userId) {
        return res.status(400).json({ message: "الرجاء توفير معرف المستخدم", status: false });
    }
    const id = uuidv4();
    const createdAt = new Date();
    const updatedAt = new Date();
    try {
        await pool.query('BEGIN')
        // هنا يجب التحقق من ان المستخدم موجود في الجيم
        const users = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
        if (users.rows.length === 0) {
            await pool.query('ROLLBACK')
            return res.status(404).json({ message: "المستخدم غير موجود", status: false });
        }
        // هنا يجب التحقق من ان المستخدم ليس مدرب بالفعل
        const existingCoach = await pool.query("SELECT * FROM coaches WHERE user_id = $1", [userId]);
        if (existingCoach.rows.length > 0) {
            await pool.query('ROLLBACK')
            return res.status(400).json({ message: "المدرب موجود بالفعل", status: false });
        }
        //هنضيف المستخدم كمدرب
        const result = await pool.query(
            `INSERT INTO coaches (user_id,speciality,branch_id,salary,created_at, updated_at) VALUES ($1, $2, $3,$4,$5,$6) RETURNING *`,
            [userId, speciality, user.branchId, salary, createdAt, updatedAt]
        );
        if (result.rows.length === 0) {
            await pool.query('ROLLBACK')
            return res.status(400).json({ message: "فشل إنشاء المدرب", status: false });
        }
        await pool.query('COMMIT')
        return res.status(201).json({ data: result.rows[0], status: true, message: "تم إنشاء المدرب بنجاح" });
    } catch (error) {
        await pool.query('ROLLBACK')
        return res.status(500).json({ message: error.message, status: false });
    }
}

const getAllCoaches = async (req, res) => {
    const { user } = req;
    try {
        const result = await pool.query(
            `SELECT coaches.*,json_build_object(
            'id',users.id,
            'full_name',users.full_name,
            'email',users.email,
            'phone',users.phone,
            'role',users.role,
            'created_at',users.created_at,
            'is_active',users.is_active,
            'gender',users.gender,
            'date_of_birthday',users.date_of_birthday
            ) as user from coaches join users on coaches.user_id = users.id where role = 'coach' and users.branch_id = $1`,
            [user.branchId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "لا يوجد مدربين", status: false });
        }
        return res.status(200).json({ data: result.rows || [], status: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
}

const getCoachById = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "الرجاء توفير معرف المدرب", status: false });
    }
    try {
        const result = await pool.query("SELECT * FROM coaches WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "مدرب غير موجود", status: false });
        }
        return res.status(200).json({ data: result.rows[0], status: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
}

const deleteCoach = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "الرجاء توفير معرف المدرب", status: false });
    }
    try {
        const result = await pool.query("DELETE FROM coaches WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "مدرب غير موجود", status: false });
        }
        return res.status(200).json({ message: "تم حذف المدرب بنجاح", status: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
}

const updateCoach = async (req, res) => {
    const { id } = req.params;
    const { user } = req;
    if (!id) {
        return res.status(400).json({ message: "الرجاء توفير معرف المدرب", status: false });
    }
    const { userId, speciality, salary } = req.body;
    if (!userId || !speciality || !salary) {
        return res.status(400).json({ message: "الرجاء ملء جميع الحقول", status: false });
    }
    try {
        // هنا يجب التحقق من ان المستخدم ليس مدرب بالفعل
        const existingCoach = await pool.query(
            "SELECT * FROM coaches WHERE user_id = $1  AND id != $2",
            [userId, id]
        );

        if (existingCoach.rows.length > 0) {
            return res.status(400).json({ message: "هذا المستخدم مسجل كمدرب بالفعل", status: false });
        }
        const result = await pool.query("UPDATE coaches SET user_id=$1, speciality=$2,salary=$3 WHERE id=$4 RETURNING *", [userId, speciality, salary, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "مدرب غير موجود", status: false });
        }
        return res.status(200).json({ data: result.rows[0], status: true, message: "تم تحديث المدرب بنجاح" });
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
}

export { createCoach, getAllCoaches, getCoachById, deleteCoach, updateCoach }