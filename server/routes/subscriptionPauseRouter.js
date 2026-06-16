import express from "express";
import { authUser } from "../middlewares/authUser.js";
import authorize from "../middlewares/authorize.js";
import {
  getAllPauses,
  getPauseById,
  createPause,
  updatePause,
  deletePause
} from "../controllers/pauseController.js";

const subscriptionPauseRouter = express.Router();

subscriptionPauseRouter.get("/", authUser, authorize(["admin", "reception"]), getAllPauses);
subscriptionPauseRouter.get("/:id", authUser, authorize(["admin", "reception"]), getPauseById);
subscriptionPauseRouter.post("/", authUser, authorize(["admin"]), createPause);
subscriptionPauseRouter.put("/:id", authUser, authorize(["admin"]), updatePause);
subscriptionPauseRouter.delete("/:id", authUser, authorize(["admin"]), deletePause);

export default subscriptionPauseRouter;



