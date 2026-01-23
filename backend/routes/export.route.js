import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
    exportTeams,
    exportContestants,
    exportCoaches,
    exportOrganisations,
} from "../controller/export.controller.js";

const router = express.Router();

// All export endpoints require admin authentication
router.get("/teams", protectRoute, exportTeams);
router.get("/contestants", protectRoute, exportContestants);
router.get("/coaches", protectRoute, exportCoaches);
router.get("/organisations", protectRoute, exportOrganisations);

export default router;
