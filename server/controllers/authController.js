import bcrypt from "bcryptjs";
import { pool } from "../models/db.js";
import { generateToken } from "../utils/generateToken.js";
import generateHashedPassword from "../utils/generateHashedPassword.js";

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "الرجاء توفير البريد الالكتروني وكلمة المرور",
      status: false,
    });
  }
  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1 ", [
      email,
    ]);
    console.log(user)
    if (user.rowCount === 0) {
      return res.status(400).json({
        message: "البريد الالكتروني او كلمه المرور غير صحيحه",
        status: false,
      });
    }
    const dbUser = user.rows[0];
    if(dbUser.role !== 'admin' && dbUser.role !== 'reception' && dbUser.role !== 'owner'){
      return res.status(401).json({
        message: "ليس لديك صلاحية الدخول",
        status: false,
      });
    }
    if(dbUser.role !== 'owner'){
      const isPasswordCorrect = await bcrypt.compare(password, dbUser.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({
          message: "البريد الالكتروني او كلمه المرور غير صحيحه",
          status: false,
        });
      }
    }
      const { password: _, ...safeUser } = dbUser;

    const token = await generateToken({
      id: safeUser.id,
      role: safeUser.role,
      gymId: safeUser.gym_id,
      branchId: safeUser.branch_id,
      user: safeUser,
    });

    return res.status(201).json({
      message: "تم تسجيل الدخول بنجاح",
      status: true,
      data: safeUser,
      token,
    });
  } catch (error) {
    if (error) {
      return res.json({ message: error.message, status: false });
    }
  }
};

const register = async (req, res) => {
  try {
    await pool.query("BEGIN");
    const { email, fullname, password, phone,address,dob,gender } = req.body;
    console.log(req.body);
    if (!email || !fullname || !password || !phone ) {
      return res.status(400).json({
        message:
          "الرجاء توفير البريد الالكتروني واسم المستخدم وكلمة المرور والهاتف وتاريخ الميلاد والجنس",
        status: false,
      });
    }
    const hashedPassword = await generateHashedPassword(password);
    // Create Gym To DB
    const createGym = await pool.query(
      "INSERT INTO gym (name, phone,is_active) VALUES ($1,$2,$3) RETURNING id",
      ["Default Gym", phone, true],
    );
    const gymId = createGym.rows[0].id;
    if (createGym.rows.length === 0 || !createGym.rows) {
      await pool.query("ROLLBACK");
      return res.json({ message: "فشل عملية التسجيل", status: false });
    }
    // Create Branch To DB
    const createBranch = await pool.query(
      "INSERT INTO branches (name, phone,is_active, address,gym_id) VALUES ($1,$2,$3,$4,$5) RETURNING id",
      ["Default Branch", phone,true, address || 'default',gymId],
    );
    const branchId = createBranch.rows[0].id;
    if (createBranch.rows.length === 0 || !createBranch.rows) {
      await pool.query("ROLLBACK");
      return res.json({ message: "فشل عملية التسجيل", status: false });
    }
    const user = await pool.query(
      "INSERT INTO users (full_name,email,password,role,gym_id,phone,address,branch_id,date_of_birthday,gender) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *",
      [fullname, email, hashedPassword, 'admin', gymId,phone,address|| 'egypt',branchId,dob || '12-4-2005',gender || 'male'],
    );
    if (user.rows.length === 0) {
        await pool.query("ROLLBACK");
      return res.json({ message: "فشل عملية التسجيل", status: false });
    }
    await pool.query("COMMIT");
    return res.status(201).json({ message: "تم التسجيل بنجاح", status: true });
  } catch (error) {
    await pool.query("ROLLBACK");
    if (error) {
      return res.json({ message: error.message, status: false });
    }
  }
};
const getUser = async (req, res) => {
  const { user } = req;
  const gymId = user.gymId;
  try {
    const subscription = await pool.query("SELECT * FROM gym_subscriptions WHERE gym_id = $1 ORDER BY id DESC LIMIT 1", [gymId]);
    return res
      .status(200)
      .json({
        message: "تم الحصول على المستخدم بنجاح",
        status: true,
        data: {
          ...user,
          subscription: subscription.rows[0] || null
        },
      });
  } catch (error) {
    if (error) {
      return res.json({ message: error.message, status: false });
    }
  }
};

export { login, register, getUser };
