import express from "express"
import { getAllExpenses, getExpense, createExpense, updateExpense, deleteExpense } from "../controllers/expensesController.js"
import authorize from "../middlewares/authorize.js";

const expensesRouter = express.Router()

expensesRouter.get("/", authorize(["admin", "reception"]), getAllExpenses)
expensesRouter.get("/:id", authorize(["admin", "reception"]), getExpense)
expensesRouter.post("/", authorize(["admin"]), createExpense)
expensesRouter.put("/:id", authorize(["admin"]), updateExpense)
expensesRouter.delete("/:id", authorize(["admin"]), deleteExpense)

export default expensesRouter
