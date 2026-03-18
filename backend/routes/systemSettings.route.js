import express from "express";
import {
    getPublicSettings,
    getAdminSettings,
    updateAdminSettings,
} from "../controller/systemSettings.controller.js";

const router = express.Router();

router.get("/public", getPublicSettings);
router.get("/admin", getAdminSettings);
router.put("/admin", updateAdminSettings);

export default router;
