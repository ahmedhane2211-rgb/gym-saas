import express from "express"
import { createPlan, deletePlan, getPlan, getPlans, updatePlans } from "../controllers/plansController.js"
import { authUser } from "../middlewares/authUser.js"

const planRouter = express.Router()

planRouter.get('/', authUser, getPlans)
planRouter.get('/:id', authUser, getPlan)
planRouter.post('/', authUser, createPlan)
planRouter.put('/:id', authUser, updatePlans)
planRouter.delete('/:id', authUser, deletePlan)

export default planRouter   