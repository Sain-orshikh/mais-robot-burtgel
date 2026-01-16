import Contestant from "../models/contestant.model.js";
import Organisation from "../models/organisation.model.js";
import { getNextContestantId } from "../utils/generateIds.js";

// Create a new contestant
export const createContestant = async (req, res) => {
    try {
        const { ovog, ner, register, email, tursunUdur, gender, phoneNumber } = req.body;
        const organisationId = req.organisation._id;

        // Validate required fields
        if (!ovog || !ner || !register || !email || !tursunUdur || !gender || !phoneNumber) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Generate contestant ID
        const contestantId = await getNextContestantId();

        // Create contestant
        const contestant = new Contestant({
            contestantId,
            ovog,
            ner,
            register,
            email,
            tursunUdur,
            gender,
            phoneNumber,
            organisationId,
        });

        await contestant.save();

        // Add contestant to organisation's contestantIds array
        await Organisation.findByIdAndUpdate(
            organisationId,
            { $push: { contestantIds: contestant._id } }
        );

        res.status(201).json(contestant);
    } catch (error) {
        console.log("Error in createContestant controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get all contestants for the logged-in organisation
export const getContestants = async (req, res) => {
    try {
        const organisationId = req.organisation._id;

        const contestants = await Contestant.find({ organisationId })
            .populate('participations.eventId', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json(contestants);
    } catch (error) {
        console.log("Error in getContestants controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get a single contestant by ID
export const getContestantById = async (req, res) => {
    try {
        const { id } = req.params;
        const organisationId = req.organisation._id;

        const contestant = await Contestant.findOne({ _id: id, organisationId })
            .populate('participations.eventId', 'name categories');

        if (!contestant) {
            return res.status(404).json({ error: "Contestant not found" });
        }

        res.status(200).json(contestant);
    } catch (error) {
        console.log("Error in getContestantById controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Update a contestant
export const updateContestant = async (req, res) => {
    try {
        const { id } = req.params;
        const organisationId = req.organisation._id;
        const { ovog, ner, register, email, tursunUdur, gender, phoneNumber } = req.body;

        const contestant = await Contestant.findOne({ _id: id, organisationId });

        if (!contestant) {
            return res.status(404).json({ error: "Contestant not found" });
        }

        // Update fields
        if (ovog) contestant.ovog = ovog;
        if (ner) contestant.ner = ner;
        if (register) contestant.register = register;
        if (email) contestant.email = email;
        if (tursunUdur) contestant.tursunUdur = tursunUdur;
        if (gender) contestant.gender = gender;
        if (phoneNumber) contestant.phoneNumber = phoneNumber;

        await contestant.save();

        res.status(200).json(contestant);
    } catch (error) {
        console.log("Error in updateContestant controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete a contestant
export const deleteContestant = async (req, res) => {
    try {
        const { id } = req.params;
        const organisationId = req.organisation._id;

        const contestant = await Contestant.findOne({ _id: id, organisationId });

        if (!contestant) {
            return res.status(404).json({ error: "Contestant not found" });
        }

        // Check if contestant is registered for any events
        if (contestant.participations && contestant.participations.length > 0) {
            return res.status(400).json({ 
                error: "Cannot delete contestant who is registered for events. Please remove from events first." 
            });
        }

        // Remove contestant from organisation's contestantIds array
        await Organisation.findByIdAndUpdate(
            organisationId,
            { $pull: { contestantIds: id } }
        );

        await Contestant.findByIdAndDelete(id);

        res.status(200).json({ message: "Contestant deleted successfully" });
    } catch (error) {
        console.log("Error in deleteContestant controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
