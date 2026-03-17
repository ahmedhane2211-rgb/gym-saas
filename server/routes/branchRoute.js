import express from "express"
import { getAllBranches,getBranch, createBranch, updateBranch, deleteBranch } from "../controllers/branchController.js"
import { authUser } from "../middlewares/authUser.js"

const branchRouter = express.Router()

branchRouter.get("/", authUser,getAllBranches)
branchRouter.get("/:id", authUser,getBranch)
branchRouter.post("/", authUser,createBranch)
branchRouter.put("/:id", authUser,updateBranch)
branchRouter.delete("/:id", authUser,deleteBranch)

export default branchRouter