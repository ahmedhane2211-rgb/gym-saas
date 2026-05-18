import express from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import upload from "../middlewares/multerConfig.js";

const settingsRouter = express.Router();

// Get settings
settingsRouter.get("/", getSettings);

// Update settings (with logo and stamp upload)
settingsRouter.put("/", upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "stamp", maxCount: 1 }
]), updateSettings);

export default settingsRouter;
