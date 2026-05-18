import express from "express"
import { createPlan, deletePlan, getPlan, getPlans, updatePlans } from "../controllers/plansController.js"
import { authUser } from "../middlewares/authUser.js"
import authorize from "../middlewares/authorize.js";
const planRouter = express.Router()

planRouter.get('/', authorize(["admin", "reception"]), getPlans)
planRouter.get('/:id', authorize(["admin", "reception"]), getPlan)
planRouter.post('/', authorize(["admin"]), createPlan)
planRouter.put('/:id', authorize(["admin"]), updatePlans)
planRouter.delete('/:id', authorize(["admin"]), deletePlan)

export default planRouter   