import express from "express";
import {
    register,
    login,
    logout,
    getMe,
    updateOrganisation,
    forgotPassword,
    resetPasswordWithOTP,
    getAllOrganisationsAdmin,
    deleteOrganisationAdmin,
} from "../controller/organisation.controller.js";
import { protectOrganisationRoute } from "../middleware/protectOrganisationRoute.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password-otp", resetPasswordWithOTP);
router.get("/me", protectOrganisationRoute, getMe);
router.put("/update", protectOrganisationRoute, updateOrganisation);

// Admin routes
router.get("/admin/all", getAllOrganisationsAdmin);
router.delete("/admin/:id", deleteOrganisationAdmin);

export default router;
