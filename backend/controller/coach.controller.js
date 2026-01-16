import Coach from "../models/coach.model.js";
import Organisation from "../models/organisation.model.js";
import { getNextCoachId } from "../utils/generateIds.js";

// Create a new coach
export const createCoach = async (req, res) => {
    try {
        const { ovog, ner, register, email, tursunUdur, gender, phoneNumber } = req.body;
        const organisationId = req.organisation._id;

        // Validate required fields
        if (!ovog || !ner || !register || !email || !tursunUdur || !gender || !phoneNumber) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Generate coach ID
        const coachId = await getNextCoachId();

        // Create coach
        const coach = new Coach({
            coachId,
            ovog,
            ner,
            register,
            email,
            tursunUdur,
            gender,
            phoneNumber,
            organisationId,
        });

        await coach.save();

        // Add coach to organisation's coachIds array
        await Organisation.findByIdAndUpdate(
            organisationId,
            { $push: { coachIds: coach._id } }
        );

        res.status(201).json(coach);
    } catch (error) {
        console.log("Error in createCoach controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get all coaches for the logged-in organisation
export const getCoaches = async (req, res) => {
    try {
        const organisationId = req.organisation._id;

        const coaches = await Coach.find({ organisationId })
            .populate('participations.eventId', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json(coaches);
    } catch (error) {
        console.log("Error in getCoaches controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get a single coach by ID
export const getCoachById = async (req, res) => {
    try {
        const { id } = req.params;
        const organisationId = req.organisation._id;

        const coach = await Coach.findOne({ _id: id, organisationId })
            .populate('participations.eventId', 'name categories');

        if (!coach) {
            return res.status(404).json({ error: "Coach not found" });
        }

        res.status(200).json(coach);
    } catch (error) {
        console.log("Error in getCoachById controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Update a coach
export const updateCoach = async (req, res) => {
    try {
        const { id } = req.params;
        const organisationId = req.organisation._id;
        const { ovog, ner, register, email, tursunUdur, gender, phoneNumber } = req.body;

        const coach = await Coach.findOne({ _id: id, organisationId });

        if (!coach) {
            return res.status(404).json({ error: "Coach not found" });
        }

        // Update fields
        if (ovog) coach.ovog = ovog;
        if (ner) coach.ner = ner;
        if (register) coach.register = register;
        if (email) coach.email = email;
        if (tursunUdur) coach.tursunUdur = tursunUdur;
        if (gender) coach.gender = gender;
        if (phoneNumber) coach.phoneNumber = phoneNumber;

        await coach.save();

        res.status(200).json(coach);
    } catch (error) {
        console.log("Error in updateCoach controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete a coach
export const deleteCoach = async (req, res) => {
    try {
        const { id } = req.params;
        const organisationId = req.organisation._id;

        const coach = await Coach.findOne({ _id: id, organisationId });

        if (!coach) {
            return res.status(404).json({ error: "Coach not found" });
        }

        // Check if coach is registered for any events
        if (coach.participations && coach.participations.length > 0) {
            return res.status(400).json({ 
                error: "Cannot delete coach who is registered for events. Please remove from events first." 
            });
        }

        // Remove coach from organisation's coachIds array
        await Organisation.findByIdAndUpdate(
            organisationId,
            { $pull: { coachIds: id } }
        );

        await Coach.findByIdAndDelete(id);

        res.status(200).json({ message: "Coach deleted successfully" });
    } catch (error) {
        console.log("Error in deleteCoach controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
