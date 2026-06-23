import express from "express";
import {
  getAllLeaves,
  getLeave,
  createLeave,
  updateLeave,
  deleteLeave,
} from "../controllers/leavesController.js";
import authorize from "../middlewares/authorize.js";

const leavesRouter = express.Router();

leavesRouter.get("/", authorize(["admin", "reception"]), getAllLeaves);
leavesRouter.get("/:id", authorize(["admin", "reception"]), getLeave);
leavesRouter.post("/", authorize(["admin"]), createLeave);
leavesRouter.put("/:id", authorize(["admin"]), updateLeave);
leavesRouter.delete("/:id", authorize(["admin"]), deleteLeave);

export default leavesRouter;
