import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { authUser } from "../middlewares/authUser.js";
import authorize from "../middlewares/authorize.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/", authorize(["admin"]), getDashboardStats);

export default dashboardRouter;
