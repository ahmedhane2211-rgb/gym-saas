import express from "express"
import { getAllBranches,getBranch, createBranch, updateBranch, deleteBranch } from "../controllers/branchController.js"
import { authUser } from "../middlewares/authUser.js"
import authorize from "../middlewares/authorize.js";
const branchRouter = express.Router()

branchRouter.get("/", authUser,authorize(["admin","reception"]),getAllBranches)
branchRouter.get("/:id", authUser,authorize(["admin","reception"]),getBranch)
branchRouter.post("/", authUser,authorize(["admin"]),createBranch)
branchRouter.put("/:id", authUser,authorize(["admin"]),updateBranch)
branchRouter.delete("/:id", authUser,authorize(["admin"]),deleteBranch)

export default branchRouter