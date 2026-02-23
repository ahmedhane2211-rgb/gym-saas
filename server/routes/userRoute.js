
import express from "express";
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/",getAllUsers)
userRouter.get("/:id",getUser)
userRouter.post("/",createUser)
userRouter.put("/:id",updateUser)
userRouter.delete("/:id",deleteUser)
export default userRouter;
