import express from "express";
import {
  getAllFreezePlans,
  getFreezePlanById,
  createFreezePlan,
  updateFreezePlan,
  deleteFreezePlan,
} from "../controllers/freezeController.js";
import { authUser } from "../middlewares/authUser.js";
import authorize from "../middlewares/authorize.js";

const subscriptionFreezeRouter = express.Router();

subscriptionFreezeRouter.get("/", authUser, authorize(["admin", "reception"]), getAllFreezePlans);
subscriptionFreezeRouter.get("/:id", authUser, authorize(["admin", "reception"]), getFreezePlanById);
subscriptionFreezeRouter.post("/", authUser, authorize(["admin"]), createFreezePlan);
subscriptionFreezeRouter.put("/:id", authUser, authorize(["admin"]), updateFreezePlan);
subscriptionFreezeRouter.delete("/:id", authUser, authorize(["admin"]), deleteFreezePlan);

export default subscriptionFreezeRouter;



