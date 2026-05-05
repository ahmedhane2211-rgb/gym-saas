import express from "express";
import { authUser } from "../middlewares/authUser.js";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../controllers/productsController.js";
import upload from "../middlewares/multerConfig.js";
import authorize from "../middlewares/authorize.js";
const productsRouter = express.Router();

productsRouter.use(authUser);

productsRouter.get("/", authorize(["admin","reception"]), getProducts);
productsRouter.post("/", authorize(["admin","reception"]), upload.single("image"), createProduct);
productsRouter.put("/:id", authorize(["admin","reception"]), upload.single("image"), updateProduct);
productsRouter.delete("/:id", authorize(["admin"]), deleteProduct);

export default productsRouter;