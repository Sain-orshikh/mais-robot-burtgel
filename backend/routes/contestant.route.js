import express from "express";
import { protectOrganisationRoute } from "../middleware/protectOrganisationRoute.js";
import {
    createContestant,
    getContestants,
    getContestantById,
    updateContestant,
    deleteContestant,
} from "../controller/contestant.controller.js";

const router = express.Router();

router.post("/", protectOrganisationRoute, createContestant);
router.get("/", protectOrganisationRoute, getContestants);
router.get("/:id", protectOrganisationRoute, getContestantById);
router.put("/:id", protectOrganisationRoute, updateContestant);
router.delete("/:id", protectOrganisationRoute, deleteContestant);

export default router;
