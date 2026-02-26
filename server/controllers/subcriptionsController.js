import { pool } from "../models/db.js"
import { v4 as uuidv4 } from "uuid";

const getSubscriptions = async (req,res)=>{
    try {
        const result = await pool.query('SELECT * FROM subscription_plans')
        return res.status(200).json({ data: result.rows || [], status: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
}
const createSubscription = async (req,res)=>{
 const {
    duration,
    gym_id,
    name,
    price,
    isActive,
    description,
  } = req.body;
  if (
    !duration ||
    !gym_id ||
    !name ||
    !price ||
    !isActive || !description
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
      `INSERT INTO subscription_plans (
        id, duration, gym_id, name, price, is_active,description,created_At,updated_At
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [
        id,
        duration,
        gym_id,
        name,
        price,
        isActive,
        description,
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
const getSubscription = async (req,res)=>{
    const {id} = req.params()
try {
        const result = await pool.query('SELECT * FROM subscription_plans WHERE id=$1',[id])
        if(result.rows.length ===0 ){
            return res.json({message:"",status:false})
        }
        return res.status(200).json({ data: result.rows[0] || [], status: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
}
const deleteSubscription = async (req,res)=>{
const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "الرجاء توفير معرف العضو", status: false });
    }
  try {
    const result = await pool.query(
      "DELETE FROM subscription_plans WHERE id = $1 RETURNING *",
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
const updateSubscription = async (req,res)=>{
try {
    
} catch (error) {
    
}
}


export {getSubscriptions,getSubscription,deleteSubscription,updateSubscription,createSubscription}