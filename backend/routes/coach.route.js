import express from "express";
import { protectOrganisationRoute } from "../middleware/protectOrganisationRoute.js";
import {
    createCoach,
    getCoaches,
    getCoachById,
    updateCoach,
    deleteCoach,
} from "../controller/coach.controller.js";

const router = express.Router();

router.post("/", protectOrganisationRoute, createCoach);
router.get("/", protectOrganisationRoute, getCoaches);
router.get("/:id", protectOrganisationRoute, getCoachById);
router.put("/:id", protectOrganisationRoute, updateCoach);
router.delete("/:id", protectOrganisationRoute, deleteCoach);

export default router;
