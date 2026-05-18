import express from "express";
import { 
    createSubscription, 
    deleteSubscription, 
    getAllSubscriptions, 
    getSubscriptionById, 
    updateSubscription 
} from "../controllers/tenantController.js";
import { authOwner } from "../middlewares/authOwner.js";

const tenantRouter = express.Router();

tenantRouter.get("/", authOwner, getAllSubscriptions);
tenantRouter.get("/:id", authOwner, getSubscriptionById);
tenantRouter.post("/", authOwner, createSubscription);
tenantRouter.put("/:id", authOwner, updateSubscription);
tenantRouter.delete("/:id", authOwner, deleteSubscription);

export default tenantRouter;
