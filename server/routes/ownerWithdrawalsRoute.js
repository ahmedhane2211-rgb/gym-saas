import express from "express";
import { getAllOwnerWithdrawals, getOwnerWithdrawal, createOwnerWithdrawal, deleteOwnerWithdrawal } from "../controllers/ownerWithdrawalsController.js";
import authorize from "../middlewares/authorize.js";

const ownerWithdrawalsRouter = express.Router();

ownerWithdrawalsRouter.get("/", authorize(["admin"]), getAllOwnerWithdrawals);
ownerWithdrawalsRouter.get("/:id", authorize(["admin"]), getOwnerWithdrawal);
ownerWithdrawalsRouter.post("/", authorize(["admin"]), createOwnerWithdrawal);
ownerWithdrawalsRouter.delete("/:id", authorize(["admin"]), deleteOwnerWithdrawal);

export default ownerWithdrawalsRouter;
