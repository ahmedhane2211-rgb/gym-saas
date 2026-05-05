import { pool } from "../models/db.js";
import { v4 as uuidv4 } from "uuid";

// 🔥 CREATE REFUND
const createRefund = async (req, res) => {
  const { invoice_id, items, reason } = req.body;
  const { branchId } = req.user;

  if (!invoice_id || !items || items.length === 0) {
    return res.status(400).json({ message: "بيانات المرتجع غير مكتملة", status: false });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // ✅ Lock branch to prevent race conditions in cash report
    await client.query('SELECT 1 FROM branches WHERE id = $1 FOR UPDATE', [branchId]);

    // 1. Validate Invoice existence and branch ownership
    const invoiceCheck = await pool.query(
      "SELECT * FROM invoices WHERE id = $1 AND branch_id = $2",
      [invoice_id, branchId]
    );

    if (invoiceCheck.rows.length === 0) {
      throw new Error("الفاتورة غير موجودة أو غير تابعة لهذا الفرع");
    }

    const originalInvoice = invoiceCheck.rows[0];

    // 2. Validate each item
    let refundTotal = 0;
    const itemsToProcess = [];

    for (const item of items) {
      // Get original item details
      const originalItemCheck = await pool.query(
        "SELECT * FROM invoice_items WHERE invoice_id = $1 AND product_id = $2",
        [invoice_id, item.product_id]
      );

      if (originalItemCheck.rows.length === 0) {
        throw new Error(`المنتج ${item.product_id} غير موجود في الفاتورة الأصلية`);
      }

      const originalItem = originalItemCheck.rows[0];

      // Get already refunded quantity for this product in this invoice
      const alreadyRefundedCheck = await pool.query(
        `SELECT COALESCE(SUM(ri.quantity), 0) as total_refunded
         FROM refund_items ri
         JOIN refunds r ON ri.refund_id = r.id
         WHERE r.invoice_id = $1 AND ri.product_id = $2`,
        [invoice_id, item.product_id]
      );

      const totalAlreadyRefunded = parseInt(alreadyRefundedCheck.rows[0].total_refunded);
      const remainingQuantiy = originalItem.quantity - totalAlreadyRefunded;

      if (item.quantity > remainingQuantiy) {
        throw new Error(`الكمية المرتجعة للمنتج ${item.product_id} تتخطى الكمية المتاحة للاشتباه (المتبقي: ${remainingQuantiy})`);
      }

      const itemRefundTotal = item.quantity * originalItem.price;
      refundTotal += itemRefundTotal;

      itemsToProcess.push({
        ...item,
        price: originalItem.price,
        total: itemRefundTotal
      });
    }

    // 3. Insert into Refunds table
    const refundId = uuidv4();
    const createdAt = new Date();
    await client.query(
      `INSERT INTO refunds (id, invoice_id, user_id, branch_id, total, reason, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [refundId, invoice_id, originalInvoice.user_id, branchId, refundTotal, reason, createdAt]
    );

    // 4. Insert into Refund Items and update Stock
    for (const item of itemsToProcess) {
      const refundItemId = uuidv4();
      await client.query(
        `INSERT INTO refund_items (id, refund_id, product_id, quantity, price, total)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [refundItemId, refundId, item.product_id, item.quantity, item.price, item.total]
      );

      // Add back to product quantity
      await client.query(
        `UPDATE products SET quantity = quantity + $1 WHERE id = $2`,
        [item.quantity, item.product_id]
      );
    }

    // 5. Update Invoice Status
    // Calculate total original items vs total refunded items
    const totalSoldResult = await client.query(
      "SELECT SUM(quantity) as total_sold FROM invoice_items WHERE invoice_id = $1",
      [invoice_id]
    );
    const totalRefundedResult = await client.query(
      `SELECT SUM(ri.quantity) as total_refunded
       FROM refund_items ri
       JOIN refunds r ON ri.refund_id = r.id
       WHERE r.invoice_id = $1`,
      [invoice_id]
    );

    const totalSold = parseInt(totalSoldResult.rows[0].total_sold);
    const totalRefunded = parseInt(totalRefundedResult.rows[0].total_refunded);

    let newStatus = 'partially_refunded';
    if (totalRefunded >= totalSold) {
      newStatus = 'refunded';
    }

    const updatedInvoice = await client.query(
      "UPDATE invoices SET status = $1 WHERE id = $2 RETURNING status",
      [newStatus, invoice_id]
    );

    // ✅ CASH REPORT RECORD (Refund is an expense/outflow)
    if (refundTotal > 0) {
      const cashRes = await client.query(
        `SELECT total_value FROM cash_report 
         WHERE branch_id = $1 
         ORDER BY created_at DESC, id DESC LIMIT 1`,
        [branchId]
      );

      const prev_total = cashRes.rowCount > 0 ? Number(cashRes.rows[0].total_value) : 0;

      await client.query(
        `INSERT INTO cash_report (type, value, total_value, branch_id) 
         VALUES ($1, $2, $3, $4)`,
        ['مرتجع منتج', -refundTotal, prev_total - refundTotal, branchId]
      );
    }

    await client.query('COMMIT');

    return res.status(201).json({
      status: true,
      message: "تمت عملية المرتجع بنجاح",
      data: {
        refund: {
          id: refundId,
          total: refundTotal,
          invoice_id
        },
        items: itemsToProcess,
        invoice_status: updatedInvoice.rows[0].status
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    return res.status(500).json({ message: error.message, status: false });
  } finally {
    client.release();
  }
};

// 🔥 GET REFUND BY ID (WITH ITEMS)
const getRefundById = async (req, res) => {
  const { id } = req.params;
  const { branchId } = req.user;

  try {
    const refundResult = await pool.query(
      "SELECT * FROM refunds WHERE id = $1 AND branch_id = $2",
      [id, branchId]
    );

    if (refundResult.rows.length === 0) {
      return res.status(404).json({ message: "المرتجع غير موجود", status: false });
    }

    const itemsResult = await pool.query(
      `SELECT ri.*, p.name as product_name, p.image as product_image
       FROM refund_items ri
       LEFT JOIN products p ON ri.product_id = p.id
       WHERE ri.refund_id = $1`,
      [id]
    );

    return res.status(200).json({
      data: {
        ...refundResult.rows[0],
        items: itemsResult.rows
      },
      status: true
    });

  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

// 🔥 GET ALL REFUNDS BY BRANCH
const getRefunds = async (req, res) => {
  const { branchId } = req.user;

  try {
    const result = await pool.query(
      `SELECT r.*, i.created_at as invoice_date
       FROM refunds r
       JOIN invoices i ON r.invoice_id = i.id
       WHERE r.branch_id = $1
       ORDER BY r.created_at DESC`,
      [branchId]
    );

    return res.status(200).json({
      data: result.rows,
      status: true
    });

  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

export { createRefund, getRefundById, getRefunds };
