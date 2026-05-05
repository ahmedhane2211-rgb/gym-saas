import express from "express";
import { authUser } from "../middlewares/authUser.js";
import { getInvoices, getInvoiceById, createInvoice, deleteInvoice } from "../controllers/invoiceController.js";

const invoiceRouter = express.Router();

import authorize from "../middlewares/authorize.js";

invoiceRouter.use(authUser);

invoiceRouter.get("/", authorize(["admin","reception"]), getInvoices);
invoiceRouter.get("/:id", authorize(["admin","reception"]), getInvoiceById);
invoiceRouter.post("/", authorize(["admin",'reception']), createInvoice);
invoiceRouter.delete("/:id", authorize(["admin"]), deleteInvoice);

export default invoiceRouter;
