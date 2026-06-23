import express from "express";
import {
  getAllLeavesPermissions,
  getLeavePermission,
  createLeavePermission,
  updateLeavePermission,
  deleteLeavePermission,
  approveLeavePermission,
  rejectLeavePermission,
} from "../controllers/leavesPermissionsController.js";
import authorize from "../middlewares/authorize.js";

const leavesPermissionsRouter = express.Router();

leavesPermissionsRouter.get("/", authorize(["admin", "reception"]), getAllLeavesPermissions);
leavesPermissionsRouter.get("/:id", authorize(["admin", "reception"]), getLeavePermission);
leavesPermissionsRouter.post("/", authorize(["admin"]), createLeavePermission);
leavesPermissionsRouter.put("/:id", authorize(["admin"]), updateLeavePermission);
leavesPermissionsRouter.delete("/:id", authorize(["admin"]), deleteLeavePermission);
leavesPermissionsRouter.put("/:id/approve", authorize(["admin"]), approveLeavePermission);
leavesPermissionsRouter.put("/:id/reject", authorize(["admin"]), rejectLeavePermission);

export default leavesPermissionsRouter;
