import express from "express"
import { getAllBranches, getBranch, createBranch, updateBranch, deleteBranch } from "../controllers/branchController.js"
import { authUser } from "../middlewares/authUser.js"
import authorize from "../middlewares/authorize.js";
const branchRouter = express.Router()

branchRouter.get("/", authorize(["admin", "reception"]), getAllBranches)
branchRouter.get("/:id", authorize(["admin", "reception"]), getBranch)
branchRouter.post("/", authorize(["admin"]), createBranch)
branchRouter.put("/:id", authorize(["admin"]), updateBranch)
branchRouter.delete("/:id", authorize(["admin"]), deleteBranch)

export default branchRouter