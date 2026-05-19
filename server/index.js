import express from "express";
import cors from "cors";
import "dotenv/config";
import { pool } from "./models/db.js";
import { memberRouter } from "./routes/membersRoute.js";
import userRouter from "./routes/userRoute.js";
import gymRouter from "./routes/gymRoute.js";
import authRouter from "./routes/authRoute.js";
import branchRouter from "./routes/branchRoute.js";
import subscribeRouter from "./routes/subscribeRoute.js";
import coachRouter from "./routes/coachRoute.js";
import planRouter from "./routes/plansRoute.js";
import attendanceRouter from "./routes/attendanceRoute.js";
import featuresRouter from "./routes/featuresRoute.js";
import featuresPlanRouter from "./routes/FeaturesPlanRoute.js";
import productsRouter from "./routes/productsRoute.js";
import invoiceRouter from "./routes/invoiceRoute.js";
import refundRouter from "./routes/refundRoute.js";
import cashReportRouter from "./routes/cashReportRoute.js";
import dashboardRouter from "./routes/dashboardRoute.js";
import tenantRouter from "./routes/tenantRoute.js";
import settingsRouter from "./routes/settingsRoute.js";
import { authUser } from "./middlewares/authUser.js";
import checkSubscription from "./middlewares/checkSubscription.js";


const app = express();
// Middleware
app.use(cors({
  origin: [
    'https://gym-saas-front.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json());

// routes
app.use("/api/auth", authRouter);
app.use("/api/tenants", tenantRouter);

// Middlewares to protect all other dashboard routes
app.use("/api", authUser, checkSubscription);

app.use("/api/gym", gymRouter);
app.use("/api/branches", branchRouter);
app.use("/api/members", memberRouter);
app.use("/api/users", userRouter);
app.use("/api/coaches", coachRouter);
app.use("/api/plans", planRouter);
app.use("/api/subscribe", subscribeRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/features", featuresRouter);
app.use("/api/features-plan", featuresPlanRouter);
app.use("/api/products", productsRouter);
app.use("/api/invoices", invoiceRouter);
app.use("/api/refunds", refundRouter);
app.use("/api/cash-report", cashReportRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/settings", settingsRouter);


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