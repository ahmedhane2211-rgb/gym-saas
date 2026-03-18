import bcrypt from "bcryptjs";
import { pool } from "../models/db.js";
import { generateToken } from "../utils/generateToken.js";
import { v4 as uuid4 } from "uuid";

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      message: "الرجاء توفير البريد الالكتروني وكلمة المرور",
      status: false,
    });
  }
  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1 ", [
      email,
    ]);
    if (user.rows.length === 0) {
      return res.json({
        message: "البريد الالكتروني او كلمه المرور غير صحيحه",
        status: false,
      });
    }
    const dbUser = user.rows[0];
    const isPasswordCorrect = await bcrypt.compare(password, dbUser.password);
    if (!isPasswordCorrect) {
      return res.json({
        message: "البريد الالكتروني او كلمه المرور غير صحيحه",
        status: false,
      });
    }
    const { password: _, ...safeUser } = dbUser;

    const token = await generateToken({
      id: safeUser.id,
      role: safeUser.role,
      gymId: safeUser.gymid,
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
  const now = new Date();
  try {
    await pool.query("BEGIN");
    const { email, fullname, password, role, phone,address } = req.body;
    console.log(req.body);
    if (!email || !fullname || !password || !phone) {
      return res.json({
        message:
          "الرجاء توفير البريد الالكتروني واسم المستخدم وكلمة المرور والهاتف",
        status: false,
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const gymId = uuid4();
    const createGym = await pool.query(
      "INSERT INTO gym (id, name, phone, created_at, updated_at) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [gymId, "Default Gym", phone, now, now],
    );
    if (createGym.rows.length === 0 || !createGym.rows) {
      await pool.query("ROLLBACK");
      return res.json({ message: "فشل عملية التسجيل", status: false });
    }
    const user = await pool.query(
      "INSERT INTO users (fullname,email,password,role,gymid,phone,address) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [fullname, email, hashedPassword, 'admin', gymId,phone,address|| 'egypt',],
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
  console.log(user);
  try {
    return res
      .status(200)
      .json({
        message: "تم الحصول على المستخدم بنجاح",
        status: true,
        data: user,
      });
  } catch (error) {
    if (error) {
      return res.json({ message: error.message, status: false });
    }
  }
};

export { login, register, getUser };
