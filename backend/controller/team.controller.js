import Team from "../models/team.model.js";
import Contestant from "../models/contestant.model.js";
import Coach from "../models/coach.model.js";
import Event from "../models/event.model.js";
import { getNextTeamId } from "../utils/generateIds.js";
import { EVENT_CATEGORIES } from "../config/categories.js";

// Create a new team and register for event
export const createTeam = async (req, res) => {
    try {
        const { eventId, categoryCode, contestantIds, coachId } = req.body;
        const organisationId = req.organisation._id;

        // Validate inputs
        if (!eventId || !categoryCode || !contestantIds || contestantIds.length === 0 || !coachId) {
            return res.status(400).json({ error: "Event, category, contestants, and coach are required" });
        }

        // Get event
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        // Check if registration is open (bypass for testing)
        if (process.env.BYPASS_REGISTRATION_CHECK !== 'true') {
            const now = new Date();
            if (now < new Date(event.registrationStart)) {
                return res.status(400).json({ error: "Registration has not started yet" });
            }
            if (now > new Date(event.registrationEnd)) {
                return res.status(400).json({ error: "Registration has ended" });
            }
        }

        // Get category configuration
        const categoryConfig = EVENT_CATEGORIES.find(cat => cat.code === categoryCode);
        if (!categoryConfig) {
            return res.status(400).json({ error: "Invalid category code" });
        }

        // Check team size constraints
        if (contestantIds.length < categoryConfig.minContestantsPerTeam || 
            contestantIds.length > categoryConfig.maxContestantsPerTeam) {
            return res.status(400).json({ 
                error: `Team must have between ${categoryConfig.minContestantsPerTeam} and ${categoryConfig.maxContestantsPerTeam} contestants` 
            });
        }

        // Check if org has reached max teams for this category in this event
        const existingTeams = await Team.countDocuments({
            organisationId,
            eventId,
            categoryCode,
            status: 'active'
        });

        if (existingTeams >= categoryConfig.maxTeamsPerOrg) {
            return res.status(400).json({ 
                error: `Maximum ${categoryConfig.maxTeamsPerOrg} team(s) per organization for this category` 
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

        // Generate team ID
        const teamId = await getNextTeamId(categoryCode);

        // Create team
        const team = new Team({
            teamId,
            organisationId,
            eventId,
            categoryCode,
            categoryName: categoryConfig.name,
            contestantIds,
            coachId,
        });

        await team.save();

        // Update contestants' participations
        await Contestant.updateMany(
            { _id: { $in: contestantIds } },
            { $push: { participations: { eventId, category: categoryCode } } }
        );

        // Update coach's participations
        await Coach.findByIdAndUpdate(
            coachId,
            { $push: { participations: { eventId, category: categoryCode } } }
        );

        // Add team to event registrations
        await Event.findByIdAndUpdate(
            eventId,
            { 
                $push: { 
                    registrations: {
                        organisationId,
                        category: categoryCode,
                        contestantIds,
                        coachId,
                        teamId: team._id
                    }
                } 
            }
        );

        const populatedTeam = await Team.findById(team._id)
            .populate('contestantIds', 'contestantId ner ovog email')
            .populate('coachId', 'coachId ner ovog email')
            .populate('eventId', 'name')
            .populate('organisationId', 'organisationId typeDetail');

        res.status(201).json(populatedTeam);
    } catch (error) {
        console.log("Error in createTeam controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get all teams for the logged-in organisation
export const getMyTeams = async (req, res) => {
    try {
        const organisationId = req.organisation._id;

        const teams = await Team.find({ organisationId })
            .populate('contestantIds', 'contestantId ner ovog')
            .populate('coachId', 'coachId ner ovog')
            .populate('eventId', 'name startDate')
            .sort({ createdAt: -1 });

        res.status(200).json(teams);
    } catch (error) {
        console.log("Error in getMyTeams controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get teams for a specific event
export const getTeamsByEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const organisationId = req.organisation._id;

        const teams = await Team.find({ eventId, organisationId })
            .populate('contestantIds', 'contestantId ner ovog')
            .populate('coachId', 'coachId ner ovog')
            .sort({ categoryCode: 1 });

        res.status(200).json(teams);
    } catch (error) {
        console.log("Error in getTeamsByEvent controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get a single team by ID
export const getTeamById = async (req, res) => {
    try {
        const { id } = req.params;
        const organisationId = req.organisation._id;

        const team = await Team.findOne({ _id: id, organisationId })
            .populate('contestantIds', 'contestantId ner ovog email phoneNumber')
            .populate('coachId', 'coachId ner ovog email phoneNumber')
            .populate('eventId', 'name description startDate endDate categories')
            .populate('organisationId', 'organisationId typeDetail');

        if (!team) {
            return res.status(404).json({ error: "Team not found" });
        }

        res.status(200).json(team);
    } catch (error) {
        console.log("Error in getTeamById controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Withdraw a team from an event (deletes the team)
export const withdrawTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const organisationId = req.organisation._id;

        const team = await Team.findOne({ _id: id, organisationId });

        if (!team) {
            return res.status(404).json({ error: "Team not found" });
        }

        // Delete the team entirely so organization can register a new one
        await Team.findByIdAndDelete(id);

        res.status(200).json({ message: "Team withdrawn successfully" });
    } catch (error) {
        console.log("Error in withdrawTeam controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
