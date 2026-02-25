import express from "express"
import { createGym, deleteGym, getGym, getGyms, updateGym } from "../controllers/gymController.js"


const gymRouter = express.Router()

gymRouter.get("/",getGyms)
gymRouter.get("/:id",getGym)
gymRouter.post("/",createGym)
gymRouter.delete("/:id",deleteGym)
gymRouter.put("/:id",updateGym)

export default gymRouter