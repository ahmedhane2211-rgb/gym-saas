import { pool } from "../models/db.js";




// Get all freeze plans
const getAllFreezePlans = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM freeze_plan ORDER BY days ASC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get freeze plan by id
const getFreezePlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM freeze_plan WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Freeze plan not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create freeze plan
const createFreezePlan = async (req, res) => {
  try {
    const { days, max_uses,name } = req.body;

    if (!days || !max_uses || !name) {
      return res.status(400).json({ message: 'days, max_uses and name are required' });
    }

    const result = await pool.query(
      'INSERT INTO freeze_plan (days, max_uses,name) VALUES ($1, $2,$3) RETURNING *',
      [days, max_uses,name]
    );
    if(result.rowCount == 0){
      return res.status(400).json({ message: 'Failed to create freeze plan' });
    }
    return res.status(201).json({ message: 'Freeze plan created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update freeze plan
const updateFreezePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { days, max_uses,name } = req.body;

    if (!days || !max_uses||!name) {
      return res.status(400).json({ message: 'days, max_uses and name are required' });
    }

    const result = await pool.query(
      'UPDATE freeze_plan SET days = $1, max_uses = $2,name = $3 WHERE id = $4 RETURNING *',
      [days, max_uses,name, id]
    );

    if (result.rowCount == 0) {
      return res.status(404).json({ message: 'Failed to update freeze plan' });
    }

    return res.status(201).json({ message: 'Freeze plan updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete freeze plan
const deleteFreezePlan = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM freeze_plan WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount == 0) {
      return res.status(404).json({ message: 'Failed to delete freeze plan' });
    }

    return res.status(201).json({ message: 'Freeze plan deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export 
{
  getAllFreezePlans,
  getFreezePlanById,
  createFreezePlan,
  updateFreezePlan,
  deleteFreezePlan,
};