import express from "express";
import { getAll, getMonthly, create, remove } from "../controllers/employeeBonusDeductionController.js";
import authorize from "../middlewares/authorize.js";
import { pool } from "../models/db.js";

const employeeBonusDeductionRouter = express.Router();

employeeBonusDeductionRouter.get("/", authorize(["admin"]), getAll);
employeeBonusDeductionRouter.get("/monthly", authorize(["admin"]), async (req, res) => {
  const { month, year } = req.query;
  const { branchId } = req.user;
  if (!month || !year) {
    return res.status(400).json({ message: "الرجاء توفير الشهر والسنة", status: false });
  }
  try {
    const result = await pool.query(
      `SELECT ebd.*, u.full_name as employee_name 
       FROM employee_bonuses_deductions ebd
       JOIN employees e ON ebd.employee_id = e.id
       JOIN users u ON e.user_id = u.id
       WHERE ebd.branch_id = $1
       AND EXTRACT(MONTH FROM ebd.date) = $2
       AND EXTRACT(YEAR FROM ebd.date) = $3
       ORDER BY ebd.date DESC`,
      [branchId, month, year]
    );
    return res.status(200).json({ data: result.rows || [], status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
});
employeeBonusDeductionRouter.get("/:employee_id/monthly", authorize(["admin"]), getMonthly);
employeeBonusDeductionRouter.post("/", authorize(["admin"]), create);
employeeBonusDeductionRouter.delete("/:id", authorize(["admin"]), remove);

export default employeeBonusDeductionRouter;
