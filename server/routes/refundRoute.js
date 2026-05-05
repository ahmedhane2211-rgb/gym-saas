import express from "express";
import { authUser } from "../middlewares/authUser.js";
import { createRefund, getRefundById, getRefunds } from "../controllers/refundController.js";
import authorize from "../middlewares/authorize.js";

const refundRouter = express.Router();

// All routes require authentication
refundRouter.use(authUser);

refundRouter.get("/", authorize(["admin","reception"]), getRefunds);
refundRouter.get("/:id", authorize(["admin","reception"]), getRefundById);
refundRouter.post("/", authorize(["admin"]), createRefund);

export default refundRouter;
