import express from "express";
import { getAllEmployeeWithdrawals, getEmployeeWithdrawal, createEmployeeWithdrawal, deleteEmployeeWithdrawal } from "../controllers/employeeWithdrawalsController.js";
import authorize from "../middlewares/authorize.js";

const employeeWithdrawalsRouter = express.Router();

employeeWithdrawalsRouter.get("/", authorize(["admin"]), getAllEmployeeWithdrawals);
employeeWithdrawalsRouter.get("/:id", authorize(["admin"]), getEmployeeWithdrawal);
employeeWithdrawalsRouter.post("/", authorize(["admin"]), createEmployeeWithdrawal);
employeeWithdrawalsRouter.delete("/:id", authorize(["admin"]), deleteEmployeeWithdrawal);

export default employeeWithdrawalsRouter;
