import { pool } from "../models/db.js";

const checkSubscription = async (req, res, next) => {
  try {

    // التأكد من وجود بيانات المستخدم أولاً
    if (!req.user) {
      return res.status(401).json({ message: "مستخدم غير معروف", status: false });
    }

    // ✅ owner bypass
    const userRole = req.user.role || (req.user.user && req.user.user.role);
    if (userRole && userRole.trim().toLowerCase() === 'owner') {
      return next();
    }



    // ✅ الروابط المسموح بها دائماً (حتى لو الاشتراك منتهي)
    const currentRoute = req.originalUrl.split('?')[0];
    if (currentRoute.includes('/auth/user')) {
      return next();
    }

    const { gymId } = req.user;

    const subscription = await pool.query(
      `SELECT status, end_date 
       FROM gym_subscriptions 
       WHERE gym_id = $1 
       ORDER BY id DESC LIMIT 1`,
      [gymId]
    );


    if (subscription.rowCount === 0) {
      return res.status(401).json({
        message: "الاشتراك غير موجود",
        status: false,
        subscriptionExpired: true
      });
    }

    const sub = subscription.rows[0];

    const isExpired =
      sub.status !== "active" ||
      new Date(sub.end_date) < new Date();

    if (isExpired) {
      return res.status(401).json({
        message: "الاشتراك غير نشط أو منتهي",
        status: false,
        subscriptionExpired: true
      });
    }

    next();

  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false
    });
  }
};

export default checkSubscription;