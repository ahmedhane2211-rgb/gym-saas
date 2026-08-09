import { pool } from "../models/db.js"

const getAllVouchers = async (req, res) => {
  const { user } = req;
    const { branchId } = user;
  
    if(!branchId) {
      return res.status(400).json({ message: "الرجاء ارسال الايدي الخاص بالفرع", status: false });
    }
  try {
    let result = await pool.query(`
      SELECT 
        v.*,
        e.name AS expense_name
      FROM vouchers v
      LEFT JOIN expenses e 
        ON v.expense_id = e.id
      WHERE v.branch_id = $1
      ORDER BY v.created_at DESC
    `, [branchId]);

    if(result.rowCount === 0) {
      return res.status(200).json({ data: [], status: true,mesaage: "لا توجد قسائم"});
    }

    return res.status(200).json({ data: result.rows || [], status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
}

const getVoucher = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('SELECT * FROM vouchers WHERE id=$1', [id])
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "القسيمة غير موجودة", status: false });
    }
    return res.status(200).json({ data: result.rows[0], status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
}

const createVoucher = async (req, res) => {
  const {
    type,
    amount,
    date,
    note,
    clientId,
    expense_id,
    revenueName
  } = req.body;
  
  const { branchId } = req.user;
  if (!type) {
    return res
      .status(400)
      .json({ message: "الرجاء ملء جميع الحقول (النوع)", status: false });
  }
  
  if (amount === undefined || amount === null || !amount) {
    return res
      .status(400)
      .json({ message: "الرجاء ملء جميع الحقول (المبلغ)", status: false });
  }

  if (!date) {
    return res
      .status(400)
      .json({ message: "الرجاء ملء جميع الحقول (التاريخ)", status: false });
  }

  if (!branchId) {
    return res
      .status(400)
      .json({ message: "الرجاء ملء جميع الحقول (الفرع)", status: false });
  }

    if(type === "payment" && !expense_id){
        return res.status(400).json({ message: "الرجاء ملء جميع الحقول (المصروف)", status: false });
    }
    if(type === "receipt" && !revenueName){
        return res.status(400).json({ message: "الرجاء ملء جميع الحقول (الايراد)", status: false });
    }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // ✅ VALIDATE BRANCH
    const branchExists = await client.query(
      `SELECT * FROM branches WHERE id = $1`, [branchId]
    );
    if (branchExists.rows.length === 0) {
      await client.query('ROLLBACK');
      return res
        .status(400)
        .json({ message: "الفرع غير موجود", status: false });
    }

    // ✅ VALIDATE MEMBER (OPTIONAL)
    if (clientId) {
      const clientExists = await client.query(
        `SELECT * FROM members WHERE id = $1`, [clientId]
      );
      if (clientExists.rows.length === 0) {
        await client.query('ROLLBACK');
        return res
          .status(400)
          .json({ message: "العميل غير موجود", status: false });
      }
    }

    // ✅ VALIDATE EXPENSE FOR PAYMENT VOUCHERS
    if (type === "payment") {
      const expenseExists = await client.query(
        `SELECT id FROM expenses WHERE id = $1`,
        [expense_id]
      );
      if (expenseExists.rowCount === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({
          message: "المصروف غير موجود",
          status: false,
        });
      }
    }

    // ✅ GET CURRENT CASH BALANCE
    const cashBalance = await client.query(
      `SELECT total_value FROM cash_report 
       WHERE branch_id = $1 
       ORDER BY created_at DESC, id DESC LIMIT 1`,
      [branchId]
    );

    const currentBalance = cashBalance.rowCount > 0 ? Number(cashBalance.rows[0].total_value) : 0;

    // ✅ CHECK IF SUFFICIENT BALANCE FOR PAYMENT
    if (type === "payment" && currentBalance < amount) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        message: `الرصيد غير كافي. الرصيد الحالي: ${currentBalance}`,
        status: false,
      });
    }

    // ✅ INSERT VOUCHER RECORD
    const result = await client.query(
      `INSERT INTO vouchers (
        type, amount, date, note, client_id, expense_id, branch_id,revenue_name
      ) VALUES ($1, $2, $3, $4, $5, $6, $7,$8) RETURNING *`,
      [type, amount, date, note || null, clientId || null, expense_id || null, branchId, revenueName || null]
    );

    // ✅ UPDATE CASH REPORT
    const newBalance = type === "receipt" 
      ? currentBalance + Number(amount)
      : currentBalance - Number(amount);

    const voucherType = type === "receipt" ? "قسيمة قبض" : "قسيمة صرف";
    
    const cashReportValue =
    type === "payment" ? -Number(amount) : Number(amount);

    await client.query(
      `INSERT INTO cash_report (type, value, total_value, branch_id)
       VALUES ($1, $2, $3, $4)`,
      [voucherType, cashReportValue, newBalance, branchId]
    );

    await client.query('COMMIT');
    
    res.status(201).json({ data: result.rows[0], status: true, message: "تم إنشاء القسيمة بنجاح" });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: error.message, status: false });
  } finally {
    client.release();
  }
}

const updateVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, date, note, clientId, expense_id } = req.body;
    const { branchId } = req.user;
    const updatedAt = new Date();
    
    if (!id) {
      return res.status(400).json({ message: "الرجاء توفير معرف القسيمة", status: false });
    }

    const result = await pool.query(
      `UPDATE vouchers SET type=$1, amount=$2, date=$3, note=$4, client_id=$5, expense_id=$6, branch_id=$7, updated_at=$8 WHERE id=$9 RETURNING *`,
      [type, amount, date, note || null, clientId || null, expense_id || null, branchId, updatedAt, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "القسيمة غير موجودة", status: false });
    }
    
    return res.status(200).json({ data: result.rows[0], status: true, message: "تم تحديث القسيمة بنجاح" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
}

const deleteVoucher = async (req, res) => {
  const { id } = req.params;
  const { branchId } = req.user;
  
  if (!id) {
    return res.status(400).json({ message: "الرجاء توفير معرف القسيمة", status: false });
  }
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // ✅ GET VOUCHER DATA
    const voucherData = await client.query(
      "SELECT * FROM vouchers WHERE id=$1",
      [id]
    );

    if (voucherData.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: "القسيمة غير موجودة", status: false });
    }

    const voucher = voucherData.rows[0];
    const { type, amount } = voucher;

    // ✅ GET CURRENT CASH BALANCE
    const cashBalance = await client.query(
      `SELECT total_value FROM cash_report 
       WHERE branch_id = $1 
       ORDER BY created_at DESC, id DESC LIMIT 1`,
      [branchId]
    );

    const currentBalance = cashBalance.rowCount > 0 ? Number(cashBalance.rows[0].total_value) : 0;

    // ✅ DELETE VOUCHER
    await client.query(
      "DELETE FROM vouchers WHERE id=$1",
      [id]
    );

    // ✅ REVERSE CASH REPORT IMPACT
    const newBalance = type === "receipt" 
      ? currentBalance - Number(amount)
      : currentBalance + Number(amount);

    const reverseType = type === "receipt" ? "استرجاع قسيمة قبض" : "استرجاع قسيمة صرف";
    
    await client.query(
      `INSERT INTO cash_report (type, value, total_value, branch_id)
       VALUES ($1, $2, $3, $4)`,
      [reverseType, type === "receipt" ? Number(-amount) : Number(amount), Number(newBalance), branchId]
    );

    await client.query('COMMIT');
    
    res.status(200).json({ message: "تم حذف القسيمة بنجاح", status: true });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: error.message, status: false });
  } finally {
    client.release();
  }
}

export { getAllVouchers, getVoucher, createVoucher, updateVoucher, deleteVoucher }
