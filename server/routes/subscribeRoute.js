import express from "express";
import { createSubscribe, deleteSubscribe, getSubscribes, updateSubscribe } from "../controllers/subscribeController.js";
import { authUser } from "../middlewares/authUser.js";
import authorize from "../middlewares/authorize.js";
const subscribeRouter = express.Router();

subscribeRouter.post("/", authUser, authorize(["admin", "reception"]), createSubscribe);
subscribeRouter.get("/", authUser, authorize(["admin", "reception"]), getSubscribes);
subscribeRouter.delete("/:id", authUser, authorize(["admin"]), deleteSubscribe);
subscribeRouter.put("/:id", authUser, authorize(["admin", "reception"]), updateSubscribe);

export default subscribeRouter;