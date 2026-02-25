import { pool } from "../models/db.js";


const getAllUsers = async(req,res)=>{
    try {
        const result = await pool.query("SELECT * FROM users");
        if(result.rows.length === 0){
            return res.status(404).json({message:"لا يوجد مستخدمين",status:false})
        }
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({message:error.message,status:false})
    }
}
const createUser = async(req,res)=>{
    const {fullName,email,password,phone,address,branchId,gymId,role,isActive,gender,dateOfBirth,photoUrl} = req.body;
    console.log(req.body)
    if(!fullName || !email || !phone || !address || !branchId || !gymId || !role || isActive === undefined || !dateOfBirth || !gender){
        return res.status(400).json({message:"الرجاء توفير جميع الحقول المطلوبة",status:false})
    }
    try {
        const result = await pool.query("INSERT INTO users (fullName,email,password,phone,address,branchId,gymId,role,isActive,gender,dateOfBirth,photoUrl) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *",
        [fullName,email,password,phone,address,branchId,gymId,role,isActive,gender,dateOfBirth,photoUrl])
        if(result.rows.length === 0){
            return res.status(400).json({message:"فشل إنشاء المستخدم",status:false})
        }
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({message:error.message,status:false})
    }
}
const getUser = async(req,res)=>{
    const {id} = req.params;
    if(!id){
        return res.status(400).json({message:"الرجاء توفير معرف المستخدم",status:false})
    }
    try {
        const result = await pool.query("SELECT * FROM users WHERE id = $1",[id]);
        if(result.rows.length === 0){
            return res.status(404).json({message:"لا يوجد مستخدم بهذا المعرف",status:false})
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({message:error.message,status:false})
    }
}
const updateUser = async(req,res)=>{
    const {id} = req.params;
    if(!id){
        return res.status(400).json({message:"الرجاء توفير معرف المستخدم",status:false})
    }
    const {fullName,email,password,phone,address,branchId,gymId,role,isActive,gender,dateOfBirth,photoUrl} = req.body;
    console.log(req.body)
    if(!fullName || !email || !phone || !address || !branchId || !gymId || !role || isActive === undefined || !dateOfBirth || !gender){
        return res.status(400).json({message:"الرجاء توفير جميع الحقول المطلوبة",status:false})
    }
    try {
        const result = await pool.query("UPDATE users SET fullName=$1,email=$2,password=$3,phone=$4,address=$5,branchId=$6,gymId=$7,role=$8,isActive=$9,gender=$10,dateOfBirth=$11,photoUrl=$12 WHERE id = $13 RETURNING *",
        [fullName,email,password,phone,address,branchId,gymId,role,isActive,gender,dateOfBirth,photoUrl,id]);
        if(result.rows.length === 0){
            return res.status(404).json({message:"لا يوجد مستخدم بهذا المعرف",status:false})
        }
        res.status(200).json({message:"تم تحديث المستخدم بنجاح",status:true});
    }
        catch (error) {
        res.status(500).json({message:error.message,status:false})
    }
}
const deleteUser = async(req,res)=>{
    const {id} = req.params;
    if(!id){
        return res.status(400).json({message:"الرجاء توفير معرف المستخدم",status:false})
    }
    try {
        const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *",[id]);
        if(result.rows.length === 0){
            return res.status(404).json({message:"لا يوجد مستخدم بهذا المعرف",status:false})
        }
        res.status(200).json({message:"تم حذف المستخدم بنجاح",status:true});
    } catch (error) {
        res.status(500).json({message:error.message,status:false})
    }

}


export {getAllUsers,createUser,getUser,updateUser,deleteUser}