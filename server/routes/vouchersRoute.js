import express from "express"
import { getAllVouchers, getVoucher, createVoucher, updateVoucher, deleteVoucher } from "../controllers/vouchersController.js"
import authorize from "../middlewares/authorize.js";

const vouchersRouter = express.Router()

vouchersRouter.get("/", authorize(["admin", "reception"]), getAllVouchers)
vouchersRouter.get("/:id", authorize(["admin", "reception"]), getVoucher)
vouchersRouter.post("/", authorize(["admin"]), createVoucher)
vouchersRouter.put("/:id", authorize(["admin"]), updateVoucher)
vouchersRouter.delete("/:id", authorize(["admin"]), deleteVoucher)

export default vouchersRouter
