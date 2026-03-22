import express from "express";
import {
    exportTeams,
    exportContestants,
    exportCoaches,
    exportOrganisations,
    exportAnalytics,
    exportOrganisationReport,
} from "../controller/export.controller.js";

const router = express.Router();

// Export endpoints (no auth required since admin is already authenticated on frontend)
router.get("/teams", exportTeams);
router.get("/contestants", exportContestants);
router.get("/coaches", exportCoaches);
router.get("/organisations", exportOrganisations);
router.get("/analytics", exportAnalytics);
router.get("/organisation-report", exportOrganisationReport);

export default router;
