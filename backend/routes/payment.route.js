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

// Admin routes
router.get("/admin/all", protectRoute, getAllPayments);
router.put("/admin/:id", protectRoute, updatePaymentStatus);

export default router;
