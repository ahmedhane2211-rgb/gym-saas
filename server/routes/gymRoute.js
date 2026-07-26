import express from "express"
import { createGym, deleteGym, getGym, getGyms, updateGym } from "../controllers/gymController.js"
import upload from "../middlewares/multerConfig.js"


const gymRouter = express.Router()

gymRouter.get("/", getGyms)
gymRouter.get("/:id", getGym)
gymRouter.post("/", upload.single("logo"), createGym)
gymRouter.delete("/:id", deleteGym)
gymRouter.put("/:id", upload.single("logo"), updateGym)

export default gymRouter