
import express from "express"
import { login, register } from "../controllers/authController.js"
import { authUser } from "../middlewares/authUser.js"

const authRouter = express.Router()

authRouter.post("/login",authUser,login)
authRouter.post("/register",register)

export default authRouter