import { pool } from "../models/db.js"
import {v4 as uuidv4} from "uuid"

const getGyms = async (req,res)=>{
    try {
        const result = await pool.query('SELECT * FROM gym')
        return res.status(200).json({ data: result.rows || [], status: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
}
const createGym = async (req,res)=>{
 const {
    phone,
    name,
    logo,
    isActive,
  } = req.body;
  console.log(req.body)
  if (
    !logo ||
    !phone ||
    !name ||
    !isActive
  ) {
    return res
      .status(400)
      .json({ message: "الرجاء ملء جميع الحقول", status: false });
  }

  const id = uuidv4();
  const createdAt = new Date();
  const updatedAt = new Date();

  try {
    const result = await pool.query(
      `INSERT INTO gym (
        id, logo, phone, name, is_Active,created_At,updated_At
      ) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [
        id,
        logo,
        phone,
        name,
        isActive,
        createdAt,
        updatedAt
      ],
    );
    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ message: "فشل إنشاء العضو", status: false });
    }
    res.status(201).json({ data: result.rows[0], status: true, message: "تم إنشاء العضو بنجاح" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
}
const getGym = async (req,res)=>{
    const {id} = req.params()
try {
        const result = await pool.query('SELECT * FROM gym WHERE id=$1',[id])
        return res.status(200).json({ data: result.rows[0] || [], status: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
}
const deleteGym = async (req,res)=>{
const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "الرجاء توفير معرف العضو", status: false });
    }
  try {
    const result = await pool.query(
      "DELETE FROM gym WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "عضو غير موجود", status: false });
    }
    res.status(200).json({ message: "تم حذف العضو بنجاح", status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
}
const updateGym = async (req,res)=>{
try {
    
} catch (error) {
    
}
}


export {getGyms,getGym,deleteGym,updateGym,createGym}