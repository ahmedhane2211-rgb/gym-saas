import express from "express";
import { authUser } from "../middlewares/authUser.js";
import { createFeaturesPlan, deleteFeaturesPlan, getAllFeaturesPlan, useFeature } from "../controllers/featuresPlanController.js";
import authorize from "../middlewares/authorize.js";


const featuresPlanRouter = express.Router()

featuresPlanRouter.get("/", authorize(["admin", "reception"]), getAllFeaturesPlan)
featuresPlanRouter.post("/", authorize(["admin"]), createFeaturesPlan)
featuresPlanRouter.delete("/:id", authorize(["admin"]), deleteFeaturesPlan)
featuresPlanRouter.post("/use-feature", authorize(["admin", "reception"]), useFeature)
export default featuresPlanRouter