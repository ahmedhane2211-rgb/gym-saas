import express from "express"
import { createSubscription, deleteSubscription, getSubscription, getSubscriptions, updateSubscription } from "../controllers/subcriptionsController.js"

const subscriptionRouter = express.Router()

subscriptionRouter.get('/',getSubscriptions)
subscriptionRouter.get('/:id',getSubscription)
subscriptionRouter.post('/',createSubscription)
subscriptionRouter.delete('/:id',updateSubscription)
subscriptionRouter.put('/:id',deleteSubscription)

export default subscriptionRouter