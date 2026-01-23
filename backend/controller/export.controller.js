import Team from "../models/team.model.js";
import Contestant from "../models/contestant.model.js";
import Coach from "../models/coach.model.js";
import Organisation from "../models/organisation.model.js";
import Payment from "../models/payment.model.js";

// Export all teams with payment approved status
export const exportTeams = async (req, res) => {
    try {
        // Fetch all teams with populated relations
        const teams = await Team.find()
            .populate({
                path: "organisationId",
                select: "_id typeDetail name type aimag email phoneNumber registriinDugaar ner ovog"
            })
            .populate({
                path: "coachId",
                select: "_id firstName lastName email phone"
            })
            .populate({
                path: "contestantIds",
                select: "_id firstName lastName email phone"
            })
            .populate({
                path: "paymentId",
                select: "_id status"
            });

        // Filter for teams with approved payments
        const approvedTeams = teams.filter(team => {
            return team.paymentId && team.paymentId.status === "approved";
        });

        res.json(approvedTeams);
    } catch (error) {
        console.error("Error exporting teams:", error.message);
        res.status(500).json({ error: "Failed to export teams" });
    }
};

// Export all contestants with team and organisation info
export const exportContestants = async (req, res) => {
    try {
        const contestants = await Contestant.find()
            .populate({
                path: "organisationId",
                select: "_id typeDetail"
            });

        res.json(contestants);
    } catch (error) {
        console.error("Error exporting contestants:", error.message);
        res.status(500).json({ error: "Failed to export contestants" });
    }
};

// Export all coaches with team info
export const exportCoaches = async (req, res) => {
    try {
        const coaches = await Coach.find()
            .populate({
                path: "organisationId",
                select: "_id typeDetail"
            });

        res.json(coaches);
    } catch (error) {
        console.error("Error exporting coaches:", error.message);
        res.status(500).json({ error: "Failed to export coaches" });
    }
};

// Export all organisations with team counts
export const exportOrganisations = async (req, res) => {
    try {
        const organisations = await Organisation.find();

        // Enrich with team counts
        const enrichedOrgs = await Promise.all(
            organisations.map(async (org) => {
                const teamCount = await Team.countDocuments({ organisationId: org._id });
                return {
                    ...org.toObject(),
                    teamCount,
                };
            })
        );

        res.json(enrichedOrgs);
    } catch (error) {
        console.error("Error exporting organisations:", error.message);
        res.status(500).json({ error: "Failed to export organisations" });
    }
};
