
import express from "express"
import { login, register, getUser, googleLoginOrRegister } from "../controllers/authController.js"
import { authUser } from "../middlewares/authUser.js"
const authRouter = express.Router()

authRouter.post("/login", login)
authRouter.post("/register", register)
authRouter.post("/google", googleLoginOrRegister)
authRouter.get("/user", authUser, getUser)

export default authRouter