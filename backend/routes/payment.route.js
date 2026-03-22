import express from "express";
import {
    submitPayment,
    getPaymentStatus,
    getAllPayments,
    updatePaymentStatus,
} from "../controller/payment.controller.js";
import { protectOrganisationRoute } from "../middleware/protectOrganisationRoute.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// Organisation routes
router.post("/", protectOrganisationRoute, submitPayment);
router.get("/event/:eventId", protectOrganisationRoute, getPaymentStatus);

// Admin routes (no auth middleware - admin pages are protected client-side)
router.get("/admin/all", getAllPayments);
router.put("/admin/:id", updatePaymentStatus);

export default router;
