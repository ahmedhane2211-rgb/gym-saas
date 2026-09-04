import { pool } from "../models/db.js";

export const getDashboardStats = async (req, res) => {
  const { branchId } = req.user;

  try {
    // 1. Summary Stats
    const stats = await pool.query(
      `
      SELECT
        (SELECT COUNT(*) FROM members WHERE branch_id = $1) as total_members,
        (SELECT COUNT(*) FROM subscription WHERE branch_id = $1 AND status = 'active' AND end_date >= NOW()) as active_subscriptions,
        (SELECT COUNT(*) FROM attendance WHERE branch_id = $1 AND DATE(check_in) = CURRENT_DATE) as attendance_today,
        (SELECT COALESCE(SUM(final_total), 0) FROM invoices WHERE branch_id = $1 AND created_at >= date_trunc('month', CURRENT_DATE)) as monthly_revenue
    `,
      [branchId],
    );

    // 2. Monthly Revenue Data (for current year)
    const monthlyRevenue = await pool.query(
      `
      SELECT 
        to_char(date_trunc('month', created_at), 'Month') as month,
        COALESCE(SUM(final_total), 0) as income
      FROM invoices
      WHERE branch_id = $1 AND created_at >= date_trunc('year', CURRENT_DATE)
      GROUP BY date_trunc('month', created_at), month
      ORDER BY date_trunc('month', created_at)
    `,
      [branchId],
    );

    // 3. Plans Distribution (Subscribers per plan)
    const plansDistribution = await pool.query(
      `
      SELECT 
        p.name as plan_name,
        COUNT(s.id) as subscriber_count
      FROM plans p
      LEFT JOIN subscription s ON p.id = s.plans_id AND s.status = 'active' AND s.end_date >= NOW()
      WHERE p.branch_id = $1
      GROUP BY p.name
    `,
      [branchId],
    );

    // 4. Last 5 users (Recent "Logins" or Registrations)
    const recentLogins = await pool.query(
      `
      SELECT u.id, u.full_name, u.email, u.role
      FROM users u
      WHERE u.branch_id = $1
      ORDER BY u.id DESC
      LIMIT 5
    `,
      [branchId],
    );

    // 5. Weekly Attendance (Last 7 days)
    const weeklyAttendance = await pool.query(
      `
      SELECT 
        to_char(date_series.day, 'YYYY-MM-DD') as day,
        COUNT(a.id) as count
      FROM (
        SELECT generate_series(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, '1 day')::date AS day
      ) date_series
      LEFT JOIN attendance a ON DATE(a.check_in) = date_series.day AND a.branch_id = $1
      GROUP BY date_series.day
      ORDER BY date_series.day
    `,
      [branchId],
    );

    return res.status(200).json({
      status: true,
      data: {
        summary: stats.rows[0],
        monthlyRevenue: monthlyRevenue.rows,
        plansDistribution: plansDistribution.rows,
        recentLogins: recentLogins.rows,
        weeklyAttendance: weeklyAttendance.rows,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
