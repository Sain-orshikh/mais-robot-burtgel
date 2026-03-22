import express from "express";
import { protectOrganisationRoute } from "../middleware/protectOrganisationRoute.js";
import {
    createEvent,
    getAllEvents,
    getEventById,
    registerTeam,
    getMyRegistrations,
    updateEvent,
    deleteEvent,
    approveRegistration,
    rejectRegistration,
} from "../controller/event.controller.js";

const router = express.Router();

// Public routes
router.get("/", getAllEvents);
router.get("/:id", getEventById);

// Protected routes (organisation must be logged in)
router.post("/:eventId/register", protectOrganisationRoute, registerTeam);
router.get("/:eventId/my-registrations", protectOrganisationRoute, getMyRegistrations);

// Admin routes (would need admin middleware in production)
router.post("/", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);
router.put("/:eventId/registrations/:registrationId/approve", approveRegistration);
router.put("/:eventId/registrations/:registrationId/reject", rejectRegistration);

export default router;
