import { pool } from '../models/db.js';

// Get all pauses (with optional filter by subscription)
const getAllPauses = async (req, res) => {
  try {
    const { subscription_id } = req.query;

    let query = `
      SELECT 
        sp.*,
        json_build_object(
          'days',
          fp.days,
          'max_uses',
          fp.max_uses
        ) AS freeze_plan,
        COUNT(sp2.id) OVER (PARTITION BY sp.subscription_id, sp.freeze_id) AS times_used
      FROM subscription_pause sp
      JOIN freeze_plan fp ON fp.id = sp.freeze_id
      LEFT JOIN subscription_pause sp2 
        ON sp2.subscription_id = sp.subscription_id 
        AND sp2.freeze_id = sp.freeze_id
    `;

    const params = [];

    if (subscription_id) {
      query += ' WHERE sp.subscription_id = $1';
      params.push(subscription_id);
    }

    query += ' ORDER BY sp.from_date DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get pause by id
const getPauseById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
        sp.*,
        fp.days,
        fp.max_uses
      FROM subscription_pause sp
      JOIN freeze_plan fp ON fp.id = sp.freeze_id
      WHERE sp.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Pause not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create pause (with usage limit check)
const createPause = async (req, res) => {
  try {
    const { subscription_id, freeze_id, from_date, to_date } = req.body;

    if (!subscription_id || !freeze_id || !from_date || !to_date) {
      return res.status(400).json({ message: 'subscription_id, freeze_id, from_date and to_date are required' });
    }

    // Check freeze plan exists
    const freezePlan = await pool.query(
      'SELECT * FROM freeze_plan WHERE id = $1',
      [freeze_id]
    );

    if (freezePlan.rowCount === 0) {
      return res.status(404).json({ message: 'Freeze plan not found' });
    }

    const { max_uses } = freezePlan.rows[0];

    // Check how many times used in current subscription
    const usageResult = await pool.query(
      `SELECT COUNT(*) AS used 
       FROM subscription_pause 
       WHERE subscription_id = $1 AND freeze_id = $2`,
      [subscription_id, freeze_id]
    );

    const timesUsed = parseInt(usageResult.rows[0].used);

    if (timesUsed >= max_uses) {
      return res.status(400).json({ 
        message: `Freeze limit reached. You have used ${timesUsed}/${max_uses} freezes for this subscription` 
      });
    }

    // Create pause
    const result = await pool.query(
      `INSERT INTO subscription_pause (subscription_id, freeze_id, from_date, to_date) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [subscription_id, freeze_id, from_date, to_date]
    );

    res.status(201).json({
      ...result.rows[0],
      times_used: timesUsed + 1,
      max_uses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update pause
const updatePause = async (req, res) => {
  try {
    const { id } = req.params;
    const { from_date, to_date } = req.body;

    if (!from_date || !to_date) {
      return res.status(400).json({ message: 'from_date and to_date are required' });
    }

    const result = await pool.query(
      `UPDATE subscription_pause 
       SET from_date = $1, to_date = $2 
       WHERE id = $3 RETURNING *`,
      [from_date, to_date, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Pause not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete pause
const deletePause = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM subscription_pause WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Pause not found' });
    }

    res.json({ message: 'Pause deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get pause history for a member (all subscriptions)
const getMemberPauseHistory = async (req, res) => {
  try {
    const { member_id } = req.params;

    const result = await pool.query(
      `SELECT 
        s.id AS subscription_id,
        s.start_date AS subscription_start,
        s.end_date AS subscription_end,
        fp.max_uses,
        COUNT(sp.id) AS times_used
      FROM subscription s
      LEFT JOIN subscription_pause sp ON sp.subscription_id = s.id
      LEFT JOIN freeze_plan fp ON sp.freeze_id = fp.id
      WHERE s.member_id = $1
      GROUP BY s.id, s.start_date, s.end_date, fp.max_uses
      ORDER BY s.start_date DESC`,
      [member_id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllPauses,
  getPauseById,
  createPause,
  updatePause,
  deletePause,
  getMemberPauseHistory,
};