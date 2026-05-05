import express from "express";
import { authUser } from "../middlewares/authUser.js";
import { createFeatures, deleteFeatures, getAllFeatures } from "../controllers/featuresController.js";
import authorize from "../middlewares/authorize.js";

const featuresRouter = express.Router()

featuresRouter.get("/", authUser, authorize(["admin","reception"]), getAllFeatures)
featuresRouter.post("/", authUser, authorize(["admin"]), createFeatures)
featuresRouter.delete("/:id", authUser, authorize(["admin"]), deleteFeatures)

export default featuresRouter