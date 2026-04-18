import { Router } from "express";
import { getAllCoaches, getCoachById, createCoach, deleteCoach, updateCoach } from "../controllers/coachController.js";
import { authUser } from "../middlewares/authUser.js";
const coachRouter = Router();

coachRouter.get("/", authUser, getAllCoaches);
coachRouter.get("/:id", authUser, getCoachById);
coachRouter.post("/", authUser, createCoach);
coachRouter.delete("/:id", authUser, deleteCoach);
coachRouter.put("/:id", authUser, updateCoach);


export default coachRouter;
