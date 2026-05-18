import express from "express";
import { authUser } from "../middlewares/authUser.js";
import { checkMemberIn, getAllAttendanceToday } from "../controllers/attendnaceController.js";
import authorize from "../middlewares/authorize.js";
const attendanceRouter = express.Router()

attendanceRouter.get("/", authorize(["admin", "reception"]), getAllAttendanceToday)
attendanceRouter.get("/:id", authorize(["admin", "reception"]), checkMemberIn)


export default attendanceRouter