import { pool } from "../models/db.js";


export const getCashReports = async (req, res) => {
  const { from, to } = req.query;

  try {
    if (!from || !to) {
      return res.status(400).json({
        message: "من فضلك حدد تاريخ البداية والنهاية",
        status: false
      });
    }

    const result = await pool.query(
      `SELECT * 
       FROM cash_report 
       WHERE branch_id = $1 
       AND created_at >= $2 
       AND created_at < $3::date + INTERVAL '1 day'
       ORDER BY created_at DESC`,
      [req.user.branchId, from, to]
    );

    return res.status(200).json({
      data: result.rows,
      status: true
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false
    });
  }
};