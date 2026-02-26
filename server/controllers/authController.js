import bcrypt from 'bcryptjs'
import { pool } from '../models/db.js';
import { generateToken } from '../utils/generateToken.js';

const login = async(req,res)=>{
    const {email,password} = req.body
    if (!email || !password) {
        return res.json({message:"الرجاء توفير البريد الالكتروني وكلمة المرور",status:false})
    }
    try {
        const user = await pool.query("SELECT * FROM users WHERE email = $1 ",[email]);
        if(user.rows.length === 0){
            return res.json({message:"البريد الالكتروني او كلمه المرور غير صحيحه",status:false})
        }
        const dbUser = user.rows[0];
        const isPasswordCorrect = await bcrypt.compare(password,dbUser.password)
        if(!isPasswordCorrect){
            return res.json({message:"البريد الالكتروني او كلمه المرور غير صحيحه",status:false})
        }
        const { password: _, ...safeUser } = dbUser;

        const token = await generateToken({
        id: safeUser.id,
        role: safeUser.role
        });

        return res.json({
        message:"تم تسجيل الدخول بنجاح",
        status:true,
        data:safeUser,
        token
        });
} catch (error) {
        if(error){
            return res.json({message:error.message,status:false})
        }
    }
}
const register = async(req,res)=>{
    try {
        const {email,fullname,password,role,address} = req.body
        console.log(req.body)
        if (!email || !fullname || !password || !role|| !address) {
            return res.json({message:"الرجاء توفير البريد الالكتروني واسم المستخدم وكلمة المرور والدور والعنوان",status:false})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const user = await pool.query("INSERT INTO users (fullname,email,password,role,address) VALUES ($1,$2,$3,$4,$5) RETURNING *",[fullname,email,hashedPassword,role,address]);
        if(user.rows.length === 0){
            return res.json({message:"فشل عملية التسجيل",status:false})
        }
        return res.json({message:"تم التسجيل بنجاح",status:true})
    } catch (error) {
        if(error){
            return res.json({message:error.message,status:false})
        }
    }
}


export {login,register}