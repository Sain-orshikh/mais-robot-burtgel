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
                select: "_id ner ovog email phoneNumber"
            })
            .populate({
                path: "contestantIds",
                select: "_id ner ovog email phoneNumber"
            })
            .populate({
                path: "paymentId",
                select: "_id status"
            });

        // Filter for teams with approved payments and transform data
        const approvedTeams = teams
            .filter(team => team.paymentId && team.paymentId.status === "approved")
            .map(team => ({
                _id: team._id,
                teamId: team.teamId,
                teamName: team.robotName, // Map robotName to teamName
                categoryCode: team.categoryCode,
                category: team.categoryName, // Map categoryName to category
                organisationName: team.organisationId?.typeDetail || team.organisationId?.name || '',
                contestantNames: team.contestantIds 
                    ? team.contestantIds.map(c => `${c.ner} ${c.ovog}`.trim()).join(', ')
                    : '',
                participantCount: team.contestantIds?.length || 0,
                coachName: team.coachId 
                    ? `${team.coachId.ner} ${team.coachId.ovog}`.trim()
                    : '',
                status: team.status,
                createdAt: team.createdAt,
            }));

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

        // Fetch all teams to find which teams have these contestants
        const teams = await Team.find().select("_id teamId contestantIds");

        // Enrich contestants with team IDs
        const enrichedContestants = contestants.map(contestant => {
            const contestantTeams = teams.filter(team => 
                team.contestantIds.some(cId => cId.toString() === contestant._id.toString())
            );
            const teamIds = contestantTeams.map(t => t.teamId).join(', ');

            return {
                _id: contestant._id,
                contestantId: contestant.contestantId,
                ner: contestant.ner,
                ovog: contestant.ovog,
                email: contestant.email,
                phoneNumber: contestant.phoneNumber,
                register: contestant.register,
                gender: contestant.gender,
                tursunUdur: contestant.tursunUdur,
                organisationName: contestant.organisationId?.typeDetail || '',
                teamIds: teamIds,
                participationCount: (contestant.participations && Array.isArray(contestant.participations)) ? contestant.participations.length : 0,
            };
        });

        res.json(enrichedContestants);
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

        // Fetch all teams to find which teams have these coaches
        const teams = await Team.find().select("_id teamId coachId");

        // Enrich coaches with team IDs
        const enrichedCoaches = coaches.map(coach => {
            const coachTeams = teams.filter(team => team.coachId.toString() === coach._id.toString());
            const teamIds = coachTeams.map(t => t.teamId).join(', ');

            return {
                _id: coach._id,
                coachId: coach.coachId,
                ner: coach.ner,
                ovog: coach.ovog,
                email: coach.email,
                phoneNumber: coach.phoneNumber,
                register: coach.register,
                gender: coach.gender,
                tursunUdur: coach.tursunUdur,
                organisationName: coach.organisationId?.typeDetail || '',
                teamIds: teamIds,
                participationCount: (coach.participations && Array.isArray(coach.participations)) ? coach.participations.length : 0,
            };
        });

        res.json(enrichedCoaches);
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
