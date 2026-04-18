import express from "express";
import cors from "cors";
import "dotenv/config";
import {pool} from "./models/db.js";
import { memberRouter } from "./routes/membersRoute.js";
import userRouter from "./routes/userRoute.js";
import gymRouter from "./routes/gymRoute.js";
import authRouter from "./routes/authRoute.js";
import branchRouter from "./routes/branchRoute.js";
import subscribeRouter from "./routes/subscribeRoute.js";
import coachRouter from "./routes/coachRoute.js";
import planRouter from "./routes/plansRoute.js";


const app = express();
// Middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/gym",gymRouter);
app.use("/api/branches",branchRouter);
app.use("/api/members",memberRouter);
app.use("/api/users",userRouter);
app.use("/api/coaches",coachRouter);
app.use("/api/auth",authRouter);
app.use("/api/plans",planRouter);
app.use("/api/subscribe",subscribeRouter);


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  try {
    await pool.query("SELECT 1");
    console.log("Database connected successfully");
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error("Database connection failed:", error);
  }
});