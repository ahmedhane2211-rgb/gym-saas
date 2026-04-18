
import express from "express";
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from "../controllers/userController.js";
import { authUser } from "../middlewares/authUser.js";
import upload from "../middlewares/multerConfig.js"
const userRouter = express.Router();

userRouter.get("/",authUser,getAllUsers)
userRouter.get("/:id",authUser,getUser)
userRouter.post("/",authUser,upload.single("photoUrl"),createUser)
userRouter.put("/:id",authUser,upload.single("photoUrl"),updateUser)
userRouter.delete("/:id",authUser,deleteUser)
export default userRouter;
