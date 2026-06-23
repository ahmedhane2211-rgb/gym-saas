import express from "express";
import {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployee,
  updateEmployee,
} from "../controllers/employeesController.js";
import authorize from "../middlewares/authorize.js";

const employeesRouter = express.Router();

employeesRouter.get("/", authorize(["admin", "reception"]), getAllEmployees);
employeesRouter.get("/:id", authorize(["admin", "reception"]), getEmployee);
employeesRouter.post("/", authorize(["admin"]), createEmployee);
employeesRouter.put("/:id", authorize(["admin"]), updateEmployee);
employeesRouter.delete("/:id", authorize(["admin"]), deleteEmployee);

export default employeesRouter;
