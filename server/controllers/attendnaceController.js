import { pool } from "../models/db.js";


const getAllAttendanceToday = async (req, res) => {

    const { user } = req;
    try {
        const result = await pool.query(
            `SELECT 
      a.*,
      json_build_object(
        'id', u.id,
        'full_name', u.full_name,
        'email', u.email
      ) AS user
   FROM attendance a
   JOIN members m ON a.member_id = m.id
   JOIN users u ON m.user_id = u.id
   WHERE a.branch_id = $1
   AND a.check_in >= CURRENT_DATE
   AND a.check_in < CURRENT_DATE + INTERVAL '1 day' 
   `,
            [user.branchId]
        );
        return res.status(200).json({ data: result.rows || [], status: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
}

const checkMemberIn = async (req, res) => {
    const { id } = req.params;
    const { user } = req;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // check member
        const member = await client.query(
        `SELECT id 
        FROM members 
        WHERE id = $1 
            AND branch_id = $2 
            AND NOT EXISTS (
            SELECT 1 FROM attendance
            WHERE member_id = $1
                AND DATE(check_in) = CURRENT_DATE
            )`,
        [id, user.branchId]
        );

        if (member.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                message: "المستخدم غير موجود او سجل دخوله اليوم",
                status: false
            });
        }

        // ✅ check subscription
        const subscription = await client.query(
            `SELECT id 
       FROM subscription
       WHERE member_id = $1
         AND branch_id = $2
         AND end_date >= NOW()
         AND status = 'active'
       ORDER BY end_date DESC
       LIMIT 1`,
            [id, user.branchId]
        );
        

        if (subscription.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                message: "الاشتراك منتهي أو غير مفعل",
                status: false
            });
        }

        // insert attendance
        const result = await client.query(
            `INSERT INTO attendance (member_id, check_in, branch_id)
       VALUES ($1, NOW(), $2)
       RETURNING *`,
            [id, user.branchId]
        );

        await client.query('COMMIT');

        return res.status(201).json({
            data: result.rows[0],
            status: true,
            message: "تم تسجيل حضور العضو بنجاح"
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

export { getAllAttendanceToday, checkMemberIn }