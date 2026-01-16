import express from "express";
import { protectOrganisationRoute } from "../middleware/protectOrganisationRoute.js";
import {
    createTeam,
    getMyTeams,
    getTeamsByEvent,
    getTeamById,
    withdrawTeam,
} from "../controller/team.controller.js";

const router = express.Router();

router.post("/", protectOrganisationRoute, createTeam);
router.get("/", protectOrganisationRoute, getMyTeams);
router.get("/event/:eventId", protectOrganisationRoute, getTeamsByEvent);
router.get("/:id", protectOrganisationRoute, getTeamById);
router.put("/:id/withdraw", protectOrganisationRoute, withdrawTeam);

export default router;
