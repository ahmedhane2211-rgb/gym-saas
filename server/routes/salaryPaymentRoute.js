import express from "express";
import { getAllPayments, getEmployeePayments, paySalary } from "../controllers/salaryPaymentController.js";
import authorize from "../middlewares/authorize.js";

const salaryPaymentRouter = express.Router();

salaryPaymentRouter.get("/", authorize(["admin"]), getAllPayments);
salaryPaymentRouter.get("/:employee_id", authorize(["admin"]), getEmployeePayments);
salaryPaymentRouter.post("/", authorize(["admin"]), paySalary);

export default salaryPaymentRouter;
