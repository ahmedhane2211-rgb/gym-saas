import { pool } from "../models/db.js"


const getAllFeatures = async (req, res) => {
    const { gymId } = req.user
    try {
        if (!gymId) return res.status(400).json({ message: "provide gym id", status: false })
        const result = await pool.query(`SELECT * FROM features where gym_id = $1`, [gymId])
        return res.status(200).json({ data: result.rows, status: true })
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false })
    }
}

const createFeatures = async (req, res) => {
    const { gymId } = req.user
    const { name } = req.body

    try {
        if (!gymId) return res.status(500).json({ message: "provide gym id", status: false })
        if (!name) return res.status(400).json({ message: "provide feature name", status: false })

        const result = await pool.query(
            `INSERT INTO features (gym_id, name) 
             VALUES ($1, $2) 
             RETURNING *`,
            [gymId, name]
        )

        return res.status(201).json({ data: result.rows[0], status: true })
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false })
    }
}

const deleteFeatures = async (req, res) => {
    const { id } = req.params;
    const { gymId } = req.user;
    if (!id) {
        return res.status(400).json({ message: "الرجاء توفير المعرف", status: false });
    }
    try {
        const result = await pool.query(
            "DELETE FROM features WHERE id = $1 AND gym_id=$2 RETURNING *",
            [id, gymId],
        );
        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Not found or not authorized",
                status: false
            });
        }
        return res.status(200).json({ message: "تم حذف الميزه بنجاح", status: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
};


export { getAllFeatures, createFeatures, deleteFeatures }