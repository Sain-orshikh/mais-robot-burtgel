import Organisation from "../models/organisation.model.js";
import jwt from "jsonwebtoken";

export const protectOrganisationRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized: Invalid Token" });
        }

        // Try to find organisation first
        const organisation = await Organisation.findById(decoded.adminId).select("-password");

        if (!organisation) {
            return res.status(404).json({ error: "Organisation not found" });
        }

        req.organisation = organisation;
        next();
    } catch (error) {
        console.log("Error in protectOrganisationRoute middleware", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
