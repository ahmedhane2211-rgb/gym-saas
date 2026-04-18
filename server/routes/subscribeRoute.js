import express from "express";
import { createSubscribe, deleteSubscribe, getSubscribes, updateSubscribe } from "../controllers/subscribeController.js";
import { authUser } from "../middlewares/authUser.js";

const subscribeRouter = express.Router();

subscribeRouter.post("/", authUser, createSubscribe);
subscribeRouter.get("/", authUser, getSubscribes);
// subscribeRouter.get("/:id", getSubscribe);
subscribeRouter.delete("/:id", authUser, deleteSubscribe);
subscribeRouter.put("/:id", authUser, updateSubscribe);

export default subscribeRouter;