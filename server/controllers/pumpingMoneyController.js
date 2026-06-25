import { pool } from "../models/db.js";

const getAllPumpingMoney = async (req, res) => {
  const { branchId } = req.user;
  try {
    const result = await pool.query(
      `SELECT * FROM pumping_money WHERE branch_id = $1 ORDER BY date DESC`,
      [branchId]
    );
    return res.status(200).json({ data: result.rows || [], status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const getPumpingMoney = async (req, res) => {
  const { id } = req.params;
  const { branchId } = req.user;
  try {
    const result = await pool.query(
      `SELECT * FROM pumping_money WHERE id = $1 AND branch_id = $2`,
      [id, branchId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "السجل غير موجود", status: false });
    }
    return res.status(200).json({ data: result.rows[0], status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const createPumpingMoney = async (req, res) => {
  const { date, notes } = req.body;
  const value = Number(req.body.value);
  const { branchId } = req.user;

  if (!value || !date) {
    return res.status(400).json({ message: "الرجاء ملء جميع الحقول المطلوبة (القيمة، التاريخ)", status: false });
  }

  if (value <= 0) {
    return res.status(400).json({ message: "القيمة يجب أن تكون موجبة", status: false });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT 1 FROM branches WHERE id = $1 FOR UPDATE", [branchId]);

    const cashDay = await client.query(
      `SELECT total_value FROM cash_report WHERE branch_id = $1 ORDER BY created_at DESC, id DESC LIMIT 1`,
      [branchId]
    );
    const currentTotal = cashDay.rowCount > 0 ? Number(cashDay.rows[0].total_value) : 0;

    const result = await client.query(
      `INSERT INTO pumping_money (value, date, notes, branch_id) VALUES ($1, $2, $3, $4) RETURNING *`,
      [value, date, notes || null, branchId]
    );

    await client.query(
      `INSERT INTO cash_report (type, value, total_value, branch_id) VALUES ($1, $2, $3, $4)`,
      ["ضخ أموال", value, currentTotal + Number(value), branchId]
    );

    await client.query("COMMIT");

    return res.status(201).json({ data: result.rows[0], status: true, message: "تم ضخ الأموال وتحديث الخزنة بنجاح" });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ message: error.message, status: false });
  } finally {
    client.release();
  }
};

const deletePumpingMoney = async (req, res) => {
  const { id } = req.params;
  const { branchId } = req.user;

  if (!id) {
    return res.status(400).json({ message: "الرجاء توفير المعرف", status: false });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT 1 FROM branches WHERE id = $1 FOR UPDATE", [branchId]);

    const record = await client.query(
      `SELECT * FROM pumping_money WHERE id = $1 AND branch_id = $2`,
      [id, branchId]
    );

    if (record.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "السجل غير موجود", status: false });
    }

    const cashDay = await client.query(
      `SELECT total_value FROM cash_report WHERE branch_id = $1 ORDER BY created_at DESC, id DESC LIMIT 1`,
      [branchId]
    );
    const currentTotal = cashDay.rowCount > 0 ? Number(cashDay.rows[0].total_value) : 0;
    const withdrawValue = Number(record.rows[0].value);

    await client.query(`DELETE FROM pumping_money WHERE id = $1`, [id]);

    await client.query(
      `INSERT INTO cash_report (type, value, total_value, branch_id) VALUES ($1, $2, $3, $4)`,
      ["حذف ضخ أموال", -withdrawValue, currentTotal - withdrawValue, branchId]
    );

    await client.query("COMMIT");

    return res.status(200).json({ message: "تم الحذف وتحديث الخزنة بنجاح", status: true });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ message: error.message, status: false });
  } finally {
    client.release();
  }
};

export { getAllPumpingMoney, getPumpingMoney, createPumpingMoney, deletePumpingMoney };
