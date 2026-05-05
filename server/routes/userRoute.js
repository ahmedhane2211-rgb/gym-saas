
import express from "express";
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from "../controllers/userController.js";
import { authUser } from "../middlewares/authUser.js";
import upload from "../middlewares/multerConfig.js"
import authorize from "../middlewares/authorize.js";
const userRouter = express.Router();

userRouter.get("/",authUser,authorize(["admin","reception"]),getAllUsers)
userRouter.get("/:id",authUser,authorize(["admin","reception"]),getUser)
userRouter.post("/",authUser,authorize(["admin","reception"]),upload.single("photoUrl"),createUser)
userRouter.put("/:id",authUser,authorize(["admin","reception"]),upload.single("photoUrl"),updateUser)
userRouter.delete("/:id",authUser,authorize(["admin"]),deleteUser)

export default userRouter;
