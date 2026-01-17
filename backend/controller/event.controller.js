import Event from "../models/event.model.js";
import Contestant from "../models/contestant.model.js";
import Coach from "../models/coach.model.js";
import Team from "../models/team.model.js";
import Payment from "../models/payment.model.js";

// Create a new event (Admin only - would need admin middleware)
export const createEvent = async (req, res) => {
    try {
        const { name, description, startDate, endDate, registrationStart, registrationEnd, location, categories } = req.body;

        if (!name || !description || !startDate || !endDate || !registrationStart || !registrationEnd || !location || !categories) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const event = new Event({
            name,
            description,
            startDate,
            endDate,
            registrationStart,
            registrationEnd,
            location,
            categories,
        });

        await event.save();

        res.status(201).json(event);
    } catch (error) {
        console.log("Error in createEvent controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get all events
export const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ startDate: -1 });
        res.status(200).json(events);
    } catch (error) {
        console.log("Error in getAllEvents controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get a single event by ID
export const getEventById = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findById(id)
            .populate('registrations.organisationId', 'organisationId typeDetail type aimag _id ner ovog phoneNumber email')
            .populate('registrations.contestantIds', 'ner ovog')
            .populate('registrations.coachId', 'ner ovog');

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        res.status(200).json(event);
    } catch (error) {
        console.log("Error in getEventById controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Register a team for an event category
export const registerTeam = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { category, contestantIds, coachId } = req.body;
        const organisationId = req.organisation._id;

        // Validate inputs
        if (!category || !contestantIds || contestantIds.length === 0 || !coachId) {
            return res.status(400).json({ error: "Category, contestants, and coach are required" });
        }

        // Get event
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        // Check if registration is open
        const now = new Date();
        if (now < new Date(event.registrationStart)) {
            return res.status(400).json({ error: "Registration has not started yet" });
        }
        if (now > new Date(event.registrationEnd)) {
            return res.status(400).json({ error: "Registration has ended" });
        }

        // Find the category in the event
        const eventCategory = event.categories.find(cat => cat.name === category);
        if (!eventCategory) {
            return res.status(400).json({ error: "Category not found in this event" });
        }

        // Check team size constraints
        if (contestantIds.length < eventCategory.minContestantsPerTeam || 
            contestantIds.length > eventCategory.maxContestantsPerTeam) {
            return res.status(400).json({ 
                error: `Team must have between ${eventCategory.minContestantsPerTeam} and ${eventCategory.maxContestantsPerTeam} contestants` 
            });
        }

        // Check if org has reached max teams for this category
        const existingTeams = event.registrations.filter(
            reg => reg.organisationId.toString() === organisationId.toString() && reg.category === category
        );

        if (existingTeams.length >= eventCategory.maxTeamsPerOrg) {
            return res.status(400).json({ 
                error: `Maximum ${eventCategory.maxTeamsPerOrg} team(s) per organization for this category` 
            });
        }

        // Verify all contestants belong to the organisation
        const contestants = await Contestant.find({
            _id: { $in: contestantIds },
            organisationId: organisationId
        });

        if (contestants.length !== contestantIds.length) {
            return res.status(400).json({ error: "One or more contestants not found or don't belong to your organisation" });
        }

        // Verify coach belongs to the organisation
        const coach = await Coach.findOne({
            _id: coachId,
            organisationId: organisationId
        });

        if (!coach) {
            return res.status(404).json({ error: "Coach not found or doesn't belong to your organisation" });
        }

        // Add registration to event
        event.registrations.push({
            organisationId,
            category,
            contestantIds,
            coachId,
        });

        await event.save();

        // Update contestants' participations
        await Contestant.updateMany(
            { _id: { $in: contestantIds } },
            { $push: { participations: { eventId, category } } }
        );

        // Update coach's participations
        await Coach.findByIdAndUpdate(
            coachId,
            { $push: { participations: { eventId, category } } }
        );

        res.status(200).json({ message: "Team registered successfully", event });
    } catch (error) {
        console.log("Error in registerTeam controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get organisation's registrations for an event
export const getMyRegistrations = async (req, res) => {
    try {
        const { eventId } = req.params;
        const organisationId = req.organisation._id;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        const myRegistrations = event.registrations.filter(
            reg => reg.organisationId.toString() === organisationId.toString()
        );

        // Populate contestant and coach details
        await Event.populate(myRegistrations, [
            { path: 'contestantIds', select: 'ner ovog email' },
            { path: 'coachId', select: 'ner ovog email' }
        ]);

        res.status(200).json(myRegistrations);
    } catch (error) {
        console.log("Error in getMyRegistrations controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Update event (Admin only)
export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const event = await Event.findByIdAndUpdate(id, updates, { new: true });

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        res.status(200).json(event);
    } catch (error) {
        console.log("Error in updateEvent controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete event (Admin only)
export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findByIdAndDelete(id);

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        // Remove event from all contestants' and coaches' participations
        await Contestant.updateMany(
            { "participations.eventId": id },
            { $pull: { participations: { eventId: id } } }
        );

        await Coach.updateMany(
            { "participations.eventId": id },
            { $pull: { participations: { eventId: id } } }
        );

        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        console.log("Error in deleteEvent controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Approve a registration (Admin only)
export const approveRegistration = async (req, res) => {
    try {
        const { eventId, registrationId } = req.params;

        if (!registrationId) {
            return res.status(400).json({ error: "Registration ID is required" });
        }

        const event = await Event.findOneAndUpdate(
            { _id: eventId, "registrations._id": registrationId },
            {
                $set: {
                    "registrations.$.status": "approved",
                    "registrations.$.rejectionReason": null,
                },
            },
            { new: true }
        );

        if (!event) {
            return res.status(404).json({ error: "Event or registration not found" });
        }

        const updatedRegistration = event.registrations.id(registrationId);

        res.status(200).json({ message: "Registration approved successfully", registration: updatedRegistration });
    } catch (error) {
        console.log("Error in approveRegistration controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Reject a registration (Admin only)
export const rejectRegistration = async (req, res) => {
    try {
        const { eventId, registrationId } = req.params;
        const { rejectionReason } = req.body;

        if (!rejectionReason || rejectionReason.trim() === '') {
            return res.status(400).json({ error: "Rejection reason is required" });
        }

        if (!registrationId) {
            return res.status(400).json({ error: "Registration ID is required" });
        }

        const event = await Event.findOneAndUpdate(
            { _id: eventId, "registrations._id": registrationId },
            {
                $set: {
                    "registrations.$.status": "rejected",
                    "registrations.$.rejectionReason": rejectionReason,
                },
            },
            { new: true }
        );

        if (!event) {
            return res.status(404).json({ error: "Event or registration not found" });
        }

        const updatedRegistration = event.registrations.id(registrationId);

        // Reset payment status for teams related to this registration (org + event + category)
        const regCategory = updatedRegistration?.category;
        const organisationId = updatedRegistration?.organisationId;

        if (regCategory && organisationId) {
            const teamsToReset = await Team.find({
                eventId,
                organisationId,
                $or: [
                    { categoryCode: regCategory },
                    { categoryName: regCategory },
                ],
            }).select("_id paymentId");

            const teamIdsToReset = teamsToReset.map((t) => t._id);

            if (teamIdsToReset.length > 0) {
                // Unlink payment from teams
                await Team.updateMany(
                    { _id: { $in: teamIdsToReset } },
                    { $set: { paymentId: null } }
                );

                // Remove teamIds from payments; delete empty payments
                const payments = await Payment.find({
                    organisationId,
                    eventId,
                    teamIds: { $in: teamIdsToReset },
                }).select("_id teamIds");

                await Promise.all(
                    payments.map(async (payment) => {
                        const remainingTeamIds = payment.teamIds.filter(
                            (teamId) => !teamIdsToReset.some((t) => t.toString() === teamId.toString())
                        );

                        if (remainingTeamIds.length === 0) {
                            await Payment.deleteOne({ _id: payment._id });
                        } else {
                            await Payment.updateOne(
                                { _id: payment._id },
                                { $set: { teamIds: remainingTeamIds } }
                            );
                        }
                    })
                );
            }
        }

        res.status(200).json({ message: "Registration rejected successfully", registration: updatedRegistration });
    } catch (error) {
        console.log("Error in rejectRegistration controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
