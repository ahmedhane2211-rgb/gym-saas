import { Router } from "express";
import { getAllCoaches, getCoachById, createCoach, deleteCoach, updateCoach } from "../controllers/coachController.js";
import { authUser } from "../middlewares/authUser.js";
import authorize from "../middlewares/authorize.js";
const coachRouter = Router();

coachRouter.get("/", authorize(["admin"]), getAllCoaches);
coachRouter.get("/:id", authorize(["admin"]), getCoachById);
coachRouter.post("/", authorize(["admin"]), createCoach);
coachRouter.delete("/:id", authorize(["admin"]), deleteCoach);
coachRouter.put("/:id", authorize(["admin"]), updateCoach);


export default coachRouter;
