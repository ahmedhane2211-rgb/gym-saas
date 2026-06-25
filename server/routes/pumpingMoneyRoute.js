import express from "express";
import { getAllPumpingMoney, getPumpingMoney, createPumpingMoney, deletePumpingMoney } from "../controllers/pumpingMoneyController.js";
import authorize from "../middlewares/authorize.js";

const pumpingMoneyRouter = express.Router();

pumpingMoneyRouter.get("/", authorize(["admin"]), getAllPumpingMoney);
pumpingMoneyRouter.get("/:id", authorize(["admin"]), getPumpingMoney);
pumpingMoneyRouter.post("/", authorize(["admin"]), createPumpingMoney);
pumpingMoneyRouter.delete("/:id", authorize(["admin"]), deletePumpingMoney);

export default pumpingMoneyRouter;
