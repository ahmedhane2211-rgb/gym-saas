import express from "express";
import cors from "cors";
import "dotenv/config";
import {pool} from "./models/db.js";
import { memberRouter } from "./routes/membersRoute.js";
import userRouter from "./routes/userRoute.js";
import subscriptionRouter from "./routes/subscriptionRoute.js";
import gymRouter from "./routes/gymRoute.js";


const app = express();
// Middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/gym",gymRouter);
app.use("/api/members",memberRouter);
app.use("/api/users",userRouter);
app.use("/api/coaches",userRouter);
app.use("/api/subscriptions",subscriptionRouter);


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => app.listen(`http://localhost:${PORT}`, async () => {
  try {
    await pool.query("SELECT 1");
    console.log("Database connected successfully");
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}));