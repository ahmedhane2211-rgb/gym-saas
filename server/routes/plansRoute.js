import express from "express"
import { createPlan, deletePlan, getPlan, getPlans, updatePlans } from "../controllers/plansController.js"
import { authUser } from "../middlewares/authUser.js"
import authorize from "../middlewares/authorize.js";
const planRouter = express.Router()

planRouter.get('/', authUser, authorize(["admin","reception"]), getPlans)
planRouter.get('/:id', authUser, authorize(["admin","reception"]), getPlan)
planRouter.post('/', authUser, authorize(["admin"]), createPlan)
planRouter.put('/:id', authUser, authorize(["admin"]), updatePlans)
planRouter.delete('/:id', authUser, authorize(["admin"]), deletePlan)

export default planRouter   