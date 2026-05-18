
import express from "express";
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from "../controllers/userController.js";
import { authUser } from "../middlewares/authUser.js";
import upload from "../middlewares/multerConfig.js"
import authorize from "../middlewares/authorize.js";
const userRouter = express.Router();

userRouter.get("/", authorize(["admin", "reception"]), getAllUsers)
userRouter.get("/:id", authorize(["admin", "reception"]), getUser)
userRouter.post("/", authorize(["admin", "reception"]), upload.single("photo"), createUser)
userRouter.put("/:id", authorize(["admin", "reception"]), upload.single("photo"), updateUser)
userRouter.delete("/:id", authorize(["admin"]), deleteUser)

export default userRouter;
