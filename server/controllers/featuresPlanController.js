import { pool } from "../models/db.js"


const getAllFeaturesPlan = async (req, res) => {
    const {gymId} = req.user
    try {
        if(!gymId) return res.status(400).json({message:"provide gym id",status:false})
        const result = await pool.query(`SELECT * FROM features_plan where gym_id = $1`,[gymId])
        return res.status(200).json({data:result.rows,status:true})
    } catch (error) {
        return res.status(500).json({message:error.message,status:false})
    }
}

const createFeaturesPlan = async (req, res) => {
    const { gymId } = req.user
    const { featuresId,planId,value } = req.body

    try {
        if (!gymId) return res.status(500).json({ message: "provide gym id", status: false })
        if (!featuresId) return res.status(400).json({ message: "provide feature Plan", status: false })
        if (!planId) return res.status(400).json({ message: "provide Plan", status: false })
        if (!value) return res.status(400).json({ message: "provide value", status: false })

            const features_id = await pool.query(`SELECT id FROM features where id = $1`,[featuresId])  
            const plans_id = await pool.query(`SELECT id FROM plans where id = $1`,[planId])  
            if (features_id.rows.length ===0) {
              return res.status(400).json({ message: "featuresId is invalid", status: false })
            }
            if (plans_id.rows.length ===0) {
              return res.status(400).json({ message: "plansId is invalid", status: false })
            }
            const check = await pool.query(`SELECT plans_id,features_id FROM features_plan where plans_id = $1 AND features_id =$2`,[plans_id.id,features_id.id])
            console.log(check)
            if (check.rowCount > 0) {
                return res.status(400).json({ message: "it's already exist", status: false })
            }
        const result = await pool.query(
            `INSERT INTO features_plan (gym_id,value, features_id,plans_id) 
             VALUES ($1, $2,$3,$4) 
             RETURNING *`,
            [gymId,value, featuresId,planId]
        )

        return res.status(201).json({ data: result.rows[0], status: true })
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false })
    }
}

const deleteFeaturesPlan = async (req,res)=>{
    const {id} = req.params
    const {gymId} = req.user
    try {
         if(!id) return res.status(400).json({message:"provide features plan",status:false})
        const result = await pool.query(`DELETE FROM features_plan where id = $1 AND gym_id = $2`,[id,gymId])
        console.log(result)
          if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Not found or not authorized",
                status: false
            });
            }
        return res.status(200).json({message:"deleted successfully",status:true})
    } catch (error) {
        return res.status(500).json({message:error.message,status:false})
    }
}
const useFeature = async (req, res) => {
  const { subscription_id, feature_id } = req.body;

  try {
    const result = await pool.query(
      `UPDATE subscription_features
       SET used = used + 1
       WHERE subscription_id = $1 
         AND featuresplan_id = $2
         AND used < total
       RETURNING *`,
      [subscription_id, feature_id]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({
        message: "feature not found or limit reached",
        status: false
      });
    }

    return res.status(200).json({
      data: result.rows[0],
      status: true
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false
    });
  }
};
export {getAllFeaturesPlan,createFeaturesPlan,deleteFeaturesPlan,useFeature}