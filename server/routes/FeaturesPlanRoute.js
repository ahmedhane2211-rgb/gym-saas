import express from "express";
import { authUser } from "../middlewares/authUser.js";
import { createFeaturesPlan, deleteFeaturesPlan, getAllFeaturesPlan, useFeature } from "../controllers/featuresPlanController.js";
import authorize from "../middlewares/authorize.js";


const featuresPlanRouter = express.Router()

featuresPlanRouter.get("/",authUser,authorize(["admin","reception"]),getAllFeaturesPlan)
featuresPlanRouter.post("/",authUser,authorize(["admin"]),createFeaturesPlan)
featuresPlanRouter.delete("/:id",authUser,authorize(["admin"]),deleteFeaturesPlan)
featuresPlanRouter.post("/use-feature",authUser,authorize(["admin","reception"]),useFeature)
export default featuresPlanRouter