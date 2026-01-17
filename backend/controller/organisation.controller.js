import Organisation from "../models/organisation.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import { getNextOrganisationId } from "../utils/generateOrgId.js";
import { sendEmail } from "../utils/sendEmail.js";

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

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const organisation = await Organisation.findOne({ email });

        if (!organisation) {
            return res.status(200).json({ message: "If that email exists, a reset code was sent." });
        }

                const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

        organisation.resetPasswordOTP = otpHash;
                organisation.resetPasswordOTPExpire = new Date(Date.now() + 5 * 60 * 1000); // 5 min

        await organisation.save();

        const subject = "Password Reset Code";
        const html = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Password Reset Code</h2>
            <p>Your OTP code is:</p>
            <h3 style="letter-spacing: 2px;">${otp}</h3>
                        <p>This code expires in 5 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
          </div>
        `;

        await sendEmail({ to: email, subject, html, text: `OTP: ${otp}` });

        return res.status(200).json({ message: "If that email exists, a reset code was sent." });
    } catch (error) {
        console.log("Error in forgotPassword controller", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const resetPasswordWithOTP = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ error: "Email, OTP, and new password are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }

        const otpHash = crypto.createHash("sha256").update(String(otp)).digest("hex");

        const organisation = await Organisation.findOne({
            email,
            resetPasswordOTP: otpHash,
            resetPasswordOTPExpire: { $gt: new Date() },
        });

        if (!organisation) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        const salt = await bcrypt.genSalt(10);
        organisation.password = await bcrypt.hash(newPassword, salt);
        organisation.resetPasswordOTP = undefined;
        organisation.resetPasswordOTPExpire = undefined;
        organisation.resetPasswordToken = undefined;
        organisation.resetPasswordExpire = undefined;

        await organisation.save();

        return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.log("Error in resetPasswordWithOTP controller", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

