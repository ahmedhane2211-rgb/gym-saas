import { pool } from "../models/db.js";
import { v4 as uuidv4 } from "uuid";

// 🔥 GET ALL INVOICES BY BRANCH
const getInvoices = async (req, res) => {
  const { branchId } = req.user;

  if (!branchId) {
    return res.status(400).json({ message: "غير مصرح لك (معرف الفرع مفقود)", status: false });
  }

  try {
    const result = await pool.query(
      `SELECT 
        i.*, 
        u.full_name as user_name,
        (SELECT COALESCE(SUM(ri.total), 0) 
         FROM refund_items ri 
         JOIN refunds r ON ri.refund_id = r.id 
         WHERE r.invoice_id = i.id) as refund_total,
        COALESCE(
          json_agg(
            json_build_object(
              'id', ii.id,
              'product_id', ii.product_id,
              'quantity', ii.quantity,
              'price', ii.price,
              'total', ii.total,
              'name', p.name,
              'image', p.image,
              'refunded_quantity', (
                SELECT COALESCE(SUM(ri.quantity), 0) 
                FROM refund_items ri 
                JOIN refunds r ON ri.refund_id = r.id 
                WHERE r.invoice_id = i.id AND ri.product_id = ii.product_id
              )
            )
          ) FILTER (WHERE ii.id IS NOT NULL), '[]'
        ) as items
       FROM invoices i
       LEFT JOIN users u ON i.user_id = u.id
       LEFT JOIN invoice_items ii ON i.id = ii.invoice_id
       LEFT JOIN products p ON ii.product_id = p.id
       WHERE i.branch_id = $1 
       GROUP BY i.id, u.full_name
       ORDER BY i.created_at DESC`,
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

// 🔥 GET INVOICE BY ID (WITH ITEMS)
const getInvoiceById = async (req, res) => {
  const { id } = req.params;
  const { branchId } = req.user;

  try {
    // Get Invoice details
    const invoiceResult = await pool.query(
      `SELECT i.*, u.full_name as user_name,
       (SELECT COALESCE(SUM(ri.total), 0) 
        FROM refund_items ri 
        JOIN refunds r ON ri.refund_id = r.id 
        WHERE r.invoice_id = i.id) as refund_total 
       FROM invoices i
       LEFT JOIN users u ON i.user_id = u.id
       WHERE i.id = $1 AND i.branch_id = $2`,
      [id, branchId]
    );

    if (invoiceResult.rows.length === 0) {
      return res.status(404).json({ message: "الفاتورة غير موجودة", status: false });
    }

    // Get Invoice items
    const itemsResult = await pool.query(
      `SELECT ii.*, p.name, p.image as product_image, p.color as product_color, p.size as product_size, p.price as product_price,
       (SELECT COALESCE(SUM(ri.quantity), 0) 
        FROM refund_items ri 
        JOIN refunds r ON ri.refund_id = r.id 
        WHERE r.invoice_id = ii.invoice_id AND ri.product_id = ii.product_id) as refunded_quantity
       FROM invoice_items ii
       LEFT JOIN products p ON ii.product_id = p.id
       WHERE ii.invoice_id = $1`,
      [id]
    );

    return res.status(200).json({
      data: {
        ...invoiceResult.rows[0],
        items: itemsResult.rows
      },
      status: true
    });

  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

// 🔥 CREATE INVOICE
const createInvoice = async (req, res) => {
  const { userId, items, total, discount, finalTotal, status } = req.body;
  const { branchId } = req.user;

  if (!branchId || !items || items.length === 0) {
    return res.status(400).json({ message: "بيانات الفاتورة غير مكتملة", status: false });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // ✅ Lock branch to prevent race conditions in cash report
    await client.query('SELECT 1 FROM branches WHERE id = $1 FOR UPDATE', [branchId]);

    const invoiceId = uuidv4();
    const createdAt = new Date();

    // 1. Insert Invoice
    await client.query(
      `INSERT INTO invoices (id, user_id, branch_id, total, discount, final_total, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [invoiceId, userId, branchId, total, discount || 0, finalTotal, status || 'paid', createdAt]
    );

    // 2. Insert Invoice Items and update product quantities
    for (const item of items) {
      const productId = item.productId || item.product_id;

      if (productId) {
        // Check current product stock
        const productCheck = await client.query(
          "SELECT name, quantity FROM products WHERE id = $1",
          [productId]
        );

        if (productCheck.rows.length === 0) {
          throw new Error(`المنتج غير موجود`);
        }

        const product = productCheck.rows[0];
        if (product.quantity < item.quantity) {
          throw new Error(`الكمية غير كافية للمنتج: ${product.name} (المتاح حالياً: ${product.quantity})`);
        }

        // Decrement product quantity
        await client.query(
          `UPDATE products SET quantity = quantity - $1 WHERE id = $2`,
          [item.quantity, productId]
        );
      }

      const itemId = uuidv4();
      await client.query(
        `INSERT INTO invoice_items (id, invoice_id, product_id, quantity, price, total)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [itemId, invoiceId, productId, item.quantity, item.price, item.total]
      );
    }

    // ✅ CASH REPORT RECORD
    const cashDay = await client.query(
      `SELECT total_value FROM cash_report 
       WHERE branch_id = $1 
       ORDER BY created_at DESC, id DESC LIMIT 1`,
      [branchId]
    );

    const prev_total = cashDay.rowCount > 0 ? Number(cashDay.rows[0].total_value) : 0;

    await client.query(
      `INSERT INTO cash_report (type, value, total_value, branch_id) 
       VALUES ($1, $2, $3, $4)`,
      ['بيع منتج', finalTotal, prev_total + Number(finalTotal), branchId]
    );

    await client.query('COMMIT');

    return res.status(201).json({
      id: invoiceId,
      status: true,
      message: "تم إنشاء الفاتورة بنجاح"
    });

  } catch (error) {
    await client.query('ROLLBACK');
    return res.status(500).json({ message: error.message, status: false });
  } finally {
    client.release();
  }
};

// 🔥 DELETE INVOICE
const deleteInvoice = async (req, res) => {
  const { id } = req.params;
  const { branchId } = req.user;

  try {
    const result = await pool.query(
      "DELETE FROM invoices WHERE id = $1 AND branch_id = $2 RETURNING *",
      [id, branchId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "الفاتورة غير موجودة", status: false });
    }

    return res.status(200).json({
      message: "تم حذف الفاتورة بنجاح",
      status: true
    });

  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

export { getInvoices, getInvoiceById, createInvoice, deleteInvoice };
