import { pool } from "../models/db.js";
import { v4 as uuidv4 } from "uuid";
import { deleteFromCloudinary } from "../middlewares/multerConfig.js";

// 🔥 GET ALL PRODUCTS BY BRANCH
const getProducts = async (req, res) => {
  const { branchId } = req.user;

  if (!branchId) {
    return res.status(400).json({ message: "غير مصرح لك (معرف الفرع مفقود)", status: false });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM products WHERE branch_id = $1 ORDER BY created_at DESC`,
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

// 🔥 CREATE PRODUCT
const createProduct = async (req, res) => {
  const { name, color, size, quantity, price, purchasePrice } = req.body;
  const { branchId } = req.user;
  const image = req.file ? req.file.path : null;

  if (!name || !price || !branchId) {
    return res.status(400).json({ message: "الاسم والسعر ومعرف الفرع حقول مطلوبة", status: false });
  }

  const id = uuidv4();
  const createdAt = new Date();

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // ✅ Lock branch to prevent race conditions in cash report
    await client.query('SELECT 1 FROM branches WHERE id = $1 FOR UPDATE', [branchId]);
    
    const result = await client.query(
      `INSERT INTO products (id, name, color, size, quantity, price, purchase_price, branch_id, image, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [id, name, color, size, quantity || 0, price, purchasePrice || 0, branchId, image, createdAt]
    );

    // ✅ CASH REPORT RECORD (Expense)
    const purchaseValue = Number(purchasePrice || 0);
    
    if (purchaseValue > 0) {
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
        ['شراء منتج', -purchaseValue, prev_total - purchaseValue, branchId]
      );
    }

    await client.query('COMMIT');

    return res.status(201).json({
      data: result.rows[0],
      status: true,
      message: "تم إضافة المنتج بنجاح"
    });
  } catch (error) {
    await client.query('ROLLBACK');
    return res.status(500).json({ message: error.message, status: false });
  } finally {
    client.release();
  }
};

// 🔥 UPDATE PRODUCT
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, color, size, quantity, price, purchasePrice } = req.body;
  const { branchId } = req.user;
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // ✅ Lock branch to prevent race conditions in cash report
    await client.query('SELECT 1 FROM branches WHERE id = $1 FOR UPDATE', [branchId]);

    // Check if product exists and get old values
    const productCheck = await client.query(
      "SELECT image, quantity, purchase_price FROM products WHERE id = $1 AND branch_id = $2",
      [id, branchId]
    );

    if (productCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: "المنتج غير موجود أو غير مصرح لك بتعديله", status: false });
    }

    let image = productCheck.rows[0].image;
    const oldQuantity = Number(productCheck.rows[0].quantity);
    
    // If new image is uploaded
    if (req.file) {
      if (image) {
        try {
          const publicId = image.split('/').pop().split('.')[0];
          await deleteFromCloudinary(`gym-saas/${publicId}`);
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }
      image = req.file.path;
    }

    const result = await client.query(
      `UPDATE products 
       SET name = $1, color = $2, size = $3, quantity = $4, price = $5, image = $6, purchase_price = $7
       WHERE id = $8 AND branch_id = $9 RETURNING *`,
      [name, color, size, quantity, price, image, purchasePrice || 0, id, branchId]
    );

    // ✅ CASH REPORT RECORD (If quantity increased)
    const newQuantity = Number(quantity);
    if (newQuantity > oldQuantity) {
      const addedQuantity = newQuantity - oldQuantity;
      const newInvestment = Number(purchasePrice || 0);

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
        ['شراء منتج', -newInvestment, prev_total - newInvestment, branchId]
      );

      // ✅ Update the cumulative purchase_price in the products table
      const oldPurchasePrice = Number(productCheck.rows[0].purchase_price || 0);
      await client.query(
        `UPDATE products SET purchase_price = $1 WHERE id = $2`,
        [oldPurchasePrice + newInvestment, id]
      );
    }

    await client.query('COMMIT');
    return res.status(200).json({
      data: result.rows[0],
      status: true,
      message: "تم تحديث المنتج بنجاح"
    });

  } catch (error) {
    await client.query('ROLLBACK');
    return res.status(500).json({ message: error.message, status: false });
  } finally {
    client.release();
  }
};

// 🔥 DELETE PRODUCT
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const { branchId } = req.user;

  try {
    // Check if product is linked to any invoices
    const invoiceCheck = await pool.query(
      "SELECT 1 FROM invoice_items WHERE product_id = $1 LIMIT 1",
      [id]
    );

    if (invoiceCheck.rows.length > 0) {
      return res.status(400).json({ 
        message: "لا يمكن حذف المنتج لأنه مرتبط ببيانات فواتير مسجلة", 
        status: false 
      });
    }

    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 AND branch_id = $2 RETURNING image",
      [id, branchId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "المنتج غير موجود", status: false });
    }

    // Delete image from Cloudinary
    if (result.rows[0].image) {
      try {
        const publicId = result.rows[0].image.split('/').pop().split('.')[0];
        await deleteFromCloudinary(`gym-saas/${publicId}`);
      } catch (err) {
        console.error("Error deleting image from Cloudinary:", err);
      }
    }

    return res.status(200).json({
      message: "تم حذف المنتج بنجاح",
      status: true
    });

  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

export { getProducts, createProduct, updateProduct, deleteProduct };
