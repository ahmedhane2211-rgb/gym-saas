import { pool } from "../models/db.js";
import { deleteImageFromCloudinary } from "../utils/deleteImageFromCloudinary.js";
import generateHashedPassword from "../utils/generateHashedPassword.js";


const getAllUsers = async(req,res)=>{
    const {user} = req;
    const branchId = user.branchId;
    try {
        const result = await pool.query(
            `SELECT users.*, employees.basic_salary 
             FROM users 
             LEFT JOIN employees ON employees.user_id = users.id 
             WHERE users.branch_id = $1 AND users.role != 'owner' AND users.role != 'admin'`, 
            [branchId]
        );
        
        return res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({message:error.message,status:false})
    }
}
const createUser = async(req,res)=>{
    const {gymId,branchId} = req.user;
    const {full_name,email,password,phone,address,role,is_active,gender,date_of_birthday,basic_salary} = req.body;
    const photoUrl = req.file ? req.file.path : null;

    if(!full_name || !email || !phone || !address || !role || is_active === undefined || !date_of_birthday || !gender){
        return res.status(400).json({message:"الرجاء توفير جميع الحقول المطلوبة",status:false})
    }
    try {
        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1",[email]);
        if(existingUser.rows.length > 0){
            return res.status(400).json({message:"المستخدم موجود بالفعل",status:false})
        }
        const hashedPassword = await generateHashedPassword(password);
        const result = await pool.query("INSERT INTO users (full_name,email,password,phone,address,branch_id,gym_id,role,is_active,gender,date_of_birthday,photo) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *",
        [full_name,email,hashedPassword,phone,address,branchId,gymId,role,is_active,gender,date_of_birthday,photoUrl])
        if(result.rows.length === 0){
            return res.status(400).json({message:"فشل إنشاء المستخدم",status:false})
        }
        const newUser = result.rows[0];

        if(role === 'reception' || role === 'coach'){
            const salary = Number(basic_salary) || 0;
            const existingEmp = await pool.query("SELECT id FROM employees WHERE user_id = $1", [newUser.id]);
            if(existingEmp.rows.length === 0){
                await pool.query(
                    `INSERT INTO employees (user_id, branch_id, name, email, phone, gender, basic_salary, total_salary, date_of_joining, active, created_at)
                     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,CURRENT_DATE,true,NOW())`,
                    [newUser.id, branchId, full_name, email, phone, gender, salary, salary]
                );
            }
        }

        return res.status(201).json({message:"تم إنشاء المستخدم بنجاح",data:newUser});
    } catch (error) {
        return res.status(500).json({message:error.message,status:false})
    }
}
const getUser = async(req,res)=>{
    const {id} = req.params;
    const {user} = req;
    const branchId = user.branchId;
    if(!id){
        return res.status(400).json({message:"الرجاء توفير معرف المستخدم",status:false})
    }
    try {
        const result = await pool.query(
            `SELECT users.*, employees.basic_salary 
             FROM users 
             LEFT JOIN employees ON employees.user_id = users.id 
             WHERE users.id = $1 AND users.branch_id = $2`,
            [id, branchId]
        );
        if(result.rows.length === 0){
            return res.status(404).json({message:"لا يوجد مستخدم بهذا المعرف",status:false})
        }
        res.status(200).json({data:result.rows[0],status:true});
    } catch (error) {
        res.status(500).json({message:error.message,status:false})
    }
}
const updateUser = async(req,res)=>{
    const {id} = req.params;
    const {gymId,branchId} = req.user;
    if(!id){
        return res.status(400).json({message:"الرجاء توفير معرف المستخدم",status:false})
    }
    const {full_name,email,password,phone,address,role,is_active,gender,date_of_birthday,basic_salary} = req.body;
    const photoUrl = req.file ? req.file.path : null;
    if(!full_name || !email || !phone || !address || !role || is_active === undefined || !date_of_birthday || !gender){
        return res.status(400).json({message:"الرجاء توفير جميع الحقول المطلوبة",status:false})
    }
    try {
        const userResult = await pool.query("SELECT photo,password FROM users WHERE id = $1 ", [id]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: "المستخدم غير موجود", status: false });
        }
        const oldPhotoUrl = userResult.rows[0].photourl;

        let finalPhotoUrl = oldPhotoUrl;
        if (req.file) {
            finalPhotoUrl = req.file.path;
            if (oldPhotoUrl) {
                await deleteImageFromCloudinary(oldPhotoUrl);
            }
        }
        let hashedPassword;
        if(password){
             hashedPassword = await generateHashedPassword(password);
        }
        const result = await pool.query("UPDATE users SET full_name=$1,email=$2,password=$3,phone=$4,address=$5,branch_id=$6,gym_id=$7,role=$8,is_active=$9,gender=$10,date_of_birthday=$11,photo=$12 WHERE id = $13 RETURNING *",
        [full_name,email,hashedPassword || userResult.rows[0].password,phone,address,branchId,gymId,role,is_active,gender,date_of_birthday,finalPhotoUrl,id]);
        if(result.rows.length === 0){
            return res.status(404).json({message:"لا يوجد مستخدم بهذا المعرف",status:false})
        }

        if(role === 'reception' || role === 'coach'){
            const salary = Number(basic_salary) || 0;
            const existingEmp = await pool.query("SELECT id FROM employees WHERE user_id = $1", [id]);
            if(existingEmp.rows.length > 0){
                await pool.query(
                    `UPDATE employees SET name=$1, email=$2, phone=$3, gender=$4, basic_salary=$5, total_salary=$6, active=true, branch_id=$7 WHERE user_id=$8`,
                    [full_name, email, phone, gender, salary, salary, branchId, id]
                );
            } else {
                await pool.query(
                    `INSERT INTO employees (user_id, branch_id, name, email, phone, gender, basic_salary, total_salary, date_of_joining, active, created_at)
                     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,CURRENT_DATE,true,NOW())`,
                    [id, branchId, full_name, email, phone, gender, salary, salary]
                );
            }
        } else {
            // If role changed away from reception/coach, deactivate employee record
            await pool.query("UPDATE employees SET active=false WHERE user_id=$1", [id]);
        }

        res.status(200).json({message:"تم تحديث المستخدم بنجاح",status:true});
    }
        catch (error) {
        res.status(500).json({message:error.message,status:false})
    }
}
const deleteUser = async(req,res)=>{
    const {id} = req.params;
    const {user} = req;
    if(!id){
        return res.status(400).json({message:"الرجاء توفير معرف المستخدم",status:false})
    }
    try {
        const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *",[id]);
        if(result.rows.length === 0){
            return res.status(404).json({message:"لا يوجد مستخدم بهذا المعرف",status:false})
        }
        // 2. حذف الصورة من كلاودناري إذا كانت موجودة
        const photoUrl = result.rows[0].photourl;
        if (photoUrl) {
            await deleteImageFromCloudinary(photoUrl);
        }
        res.status(200).json({message:"تم حذف المستخدم بنجاح",status:true});
    } catch (error) {
        res.status(500).json({message:error.message,status:false})
    }

}


export {getAllUsers,createUser,getUser,updateUser,deleteUser}