import express from "express";
import {
    register,
    login,
    logout,
    getMe,
    updateOrganisation
} from "../controller/organisation.controller.js";
import { protectOrganisationRoute } from "../middleware/protectOrganisationRoute.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protectOrganisationRoute, getMe);
router.put("/update", protectOrganisationRoute, updateOrganisation);

export default router;
