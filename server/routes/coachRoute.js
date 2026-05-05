import { Router } from "express";
import { getAllCoaches, getCoachById, createCoach, deleteCoach, updateCoach } from "../controllers/coachController.js";
import { authUser } from "../middlewares/authUser.js";
import authorize from "../middlewares/authorize.js";
const coachRouter = Router();

coachRouter.get("/", authUser, authorize(["admin"]), getAllCoaches);
coachRouter.get("/:id", authUser, authorize(["admin"]), getCoachById);
coachRouter.post("/", authUser, authorize(["admin"]), createCoach);
coachRouter.delete("/:id", authUser, authorize(["admin"]), deleteCoach);
coachRouter.put("/:id", authUser, authorize(["admin"]), updateCoach);


export default coachRouter;
