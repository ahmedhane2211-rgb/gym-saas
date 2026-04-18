import express from "express"
import { createGym, deleteGym, getGym, getGyms, updateGym } from "../controllers/gymController.js"
import upload from "../middlewares/multerConfig.js"
import { authUser } from "../middlewares/authUser.js"


const gymRouter = express.Router()

gymRouter.get("/", authUser, getGyms)
gymRouter.get("/:id", authUser, getGym)
gymRouter.post("/", authUser, upload.single("logo"), createGym)
gymRouter.delete("/:id", authUser, deleteGym)
gymRouter.put("/:id", authUser, upload.single("logo"), updateGym)

export default gymRouter