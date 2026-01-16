import Organisation from "../models/organisation.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import { getNextOrganisationId } from "../utils/generateOrgId.js";

export const register = async (req, res) => {
    try {
        const {
            type,
            typeDetail,
            aimag,
            phoneNumber,
            ner,
            ovog,
            registriinDugaar,
            email,
            password
        } = req.body;

        // Validate all required fields
        if (!type || !typeDetail || !aimag || !phoneNumber || !ner || !ovog || !registriinDugaar || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Validate type
        if (!['company', 'school', 'individual'].includes(type)) {
            return res.status(400).json({ error: "Invalid organisation type" });
        }

        // Check if email already exists
        const existingEmail = await Organisation.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Check if registration number already exists
        const existingRegNum = await Organisation.findOne({ registriinDugaar });
        if (existingRegNum) {
            return res.status(400).json({ error: "Registration number already exists" });
        }

        // Generate unique organisation ID atomically (prevents duplicates in concurrent requests)
        const organisationId = await getNextOrganisationId();

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new organisation
        const newOrganisation = new Organisation({
            organisationId,
            type,
            typeDetail,
            aimag,
            phoneNumber,
            ner,
            ovog,
            registriinDugaar,
            email,
            password: hashedPassword,
        });

        await newOrganisation.save();

        // Generate token and set cookie
        generateTokenAndSetCookie(newOrganisation._id, res);

        res.status(201).json({
            _id: newOrganisation._id,
            organisationId: newOrganisation.organisationId,
            type: newOrganisation.type,
            typeDetail: newOrganisation.typeDetail,
            aimag: newOrganisation.aimag,
            phoneNumber: newOrganisation.phoneNumber,
            ner: newOrganisation.ner,
            ovog: newOrganisation.ovog,
            email: newOrganisation.email,
        });
    } catch (error) {
        console.log("Error in register controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const organisation = await Organisation.findOne({ email });
        const isPasswordCorrect = await bcrypt.compare(password, organisation?.password || "");

        if (!organisation || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Update last login timestamp
        organisation.lastLogin = new Date();
        await organisation.save();

        generateTokenAndSetCookie(organisation._id, res);

        res.status(200).json({
            _id: organisation._id,
            organisationId: organisation.organisationId,
            type: organisation.type,
            typeDetail: organisation.typeDetail,
            aimag: organisation.aimag,
            phoneNumber: organisation.phoneNumber,
            ner: organisation.ner,
            ovog: organisation.ovog,
            email: organisation.email,
            lastLogin: organisation.lastLogin,
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMe = async (req, res) => {
    try {
        const organisation = await Organisation.findById(req.organisation._id).select("-password");
        res.status(200).json(organisation);
    } catch (error) {
        console.log("Error in getMe controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateOrganisation = async (req, res) => {
    try {
        const organisationId = req.organisation._id;
        const {
            type,
            typeDetail,
            aimag,
            phoneNumber,
            ner,
            ovog,
            registriinDugaar,
            email,
            currentPassword,
            newPassword
        } = req.body;

        const organisation = await Organisation.findById(organisationId);

        if (!organisation) {
            return res.status(404).json({ error: "Organisation not found" });
        }

        // If changing password, verify current password
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ error: "Current password is required to change password" });
            }

            const isPasswordCorrect = await bcrypt.compare(currentPassword, organisation.password);
            if (!isPasswordCorrect) {
                return res.status(400).json({ error: "Current password is incorrect" });
            }

            const salt = await bcrypt.genSalt(10);
            organisation.password = await bcrypt.hash(newPassword, salt);
        }

        // Update fields if provided
        if (type && ['company', 'school', 'individual'].includes(type)) {
            organisation.type = type;
        }
        if (typeDetail) organisation.typeDetail = typeDetail;
        if (aimag) organisation.aimag = aimag;
        if (phoneNumber) organisation.phoneNumber = phoneNumber;
        if (ner) organisation.ner = ner;
        if (ovog) organisation.ovog = ovog;
        
        // Check if registriinDugaar is being changed and if it's already taken
        if (registriinDugaar && registriinDugaar !== organisation.registriinDugaar) {
            const existingRegNum = await Organisation.findOne({ registriinDugaar });
            if (existingRegNum) {
                return res.status(400).json({ error: "Registration number already exists" });
            }
            organisation.registriinDugaar = registriinDugaar;
        }
        
        // Check if email is being changed and if it's already taken
        if (email && email !== organisation.email) {
            const existingEmail = await Organisation.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ error: "Email already exists" });
            }
            organisation.email = email;
        }

        await organisation.save();

        res.status(200).json({
            _id: organisation._id,
            organisationId: organisation.organisationId,
            type: organisation.type,
            typeDetail: organisation.typeDetail,
            aimag: organisation.aimag,
            phoneNumber: organisation.phoneNumber,
            ner: organisation.ner,
            ovog: organisation.ovog,
            email: organisation.email,
        });
    } catch (error) {
        console.log("Error in updateOrganisation controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
