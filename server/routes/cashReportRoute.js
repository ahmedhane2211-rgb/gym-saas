import express from "express";
import { authUser } from "../middlewares/authUser.js";
import { getCashReports } from "../controllers/cashReportController.js";
import authorize from "../middlewares/authorize.js";
const cashReportRouter = express.Router();

// All routes require authentication
cashReportRouter.use(authUser);

cashReportRouter.get("/",authorize(["admin"]), getCashReports);

export default cashReportRouter;
