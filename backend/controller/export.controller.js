import Team from "../models/team.model.js";
import Contestant from "../models/contestant.model.js";
import Coach from "../models/coach.model.js";
import Organisation from "../models/organisation.model.js";
import Payment from "../models/payment.model.js";
import Event from "../models/event.model.js";

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
                const safeOrganisationId = org.organisationId || org._id?.toString() || "";

                return {
                    // Keep _id aligned with business ID for CSV consumers that prioritize _id.
                    _id: safeOrganisationId,
                    organisationId: safeOrganisationId,
                    type: org.type,
                    typeDetail: org.typeDetail,
                    aimag: org.aimag,
                    phoneNumber: org.phoneNumber,
                    ner: org.ner,
                    ovog: org.ovog,
                    registriinDugaar: org.registriinDugaar,
                    email: org.email,
                    createdAt: org.createdAt,
                    updatedAt: org.updatedAt,
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

// Real analytics for admin dashboard
export const exportAnalytics = async (req, res) => {
    try {
        const [
            totalTeams,
            totalContestants,
            totalCoaches,
            totalOrganisations,
            approvedPayments,
            events,
        ] = await Promise.all([
            Team.countDocuments({ status: "active" }),
            Contestant.countDocuments(),
            Coach.countDocuments(),
            Organisation.countDocuments(),
            Payment.find({ status: "approved" }).select("teamIds"),
            Event.find()
                .populate("registrations.organisationId", "typeDetail organisationId")
                .select("name registrations"),
        ]);

        const paymentApprovedTeams = approvedPayments.reduce((sum, payment) => {
            const teamCount = Array.isArray(payment.teamIds) ? payment.teamIds.length : 0;
            return sum + teamCount;
        }, 0);

        const paymentProcessedMNT = paymentApprovedTeams * 20000;

        const allRegistrations = events.flatMap((event) =>
            (event.registrations || []).map((reg) => ({
                eventName: event.name,
                registeredAt: reg.registeredAt,
                status: reg.status || "pending",
                category: reg.category,
                categories: Array.isArray(reg.categories) ? reg.categories : [],
                organisationName: reg.organisationId?.typeDetail || "Unknown",
            }))
        );

        const stats = {
            total: allRegistrations.length,
            approved: allRegistrations.filter((reg) => reg.status === "approved").length,
            pending: allRegistrations.filter((reg) => reg.status === "pending").length,
            rejected: allRegistrations.filter((reg) => reg.status === "rejected").length,
        };

        const categoryStats = {};
        for (const reg of allRegistrations) {
            if (reg.categories.length > 0) {
                for (const category of reg.categories) {
                    categoryStats[category] = (categoryStats[category] || 0) + 1;
                }
            } else {
                const key = reg.category || "Uncategorized";
                categoryStats[key] = (categoryStats[key] || 0) + 1;
            }
        }

        const schoolCounts = {};
        for (const reg of allRegistrations) {
            const school = reg.organisationName || "Unknown";
            schoolCounts[school] = (schoolCounts[school] || 0) + 1;
        }

        const schoolStats = Object.entries(schoolCounts)
            .map(([school, count]) => ({ school, count }))
            .sort((a, b) => b.count - a.count);

        const registrationsByDate = {};
        for (const reg of allRegistrations) {
            if (!reg.registeredAt) continue;
            const dateKey = new Date(reg.registeredAt).toISOString().split("T")[0];
            registrationsByDate[dateKey] = (registrationsByDate[dateKey] || 0) + 1;
        }

        res.status(200).json({
            stats,
            totals: {
                teams: totalTeams,
                coaches: totalCoaches,
                organisations: totalOrganisations,
                contestants: totalContestants,
                paymentApprovedTeams,
                paymentProcessedMNT,
            },
            categoryStats,
            schoolStats,
            registrationsByDate,
        });
    } catch (error) {
        console.error("Error exporting analytics:", error.message);
        res.status(500).json({ error: "Failed to export analytics" });
    }
};

// Export organisation report with teams and members (with approved payments)
export const exportOrganisationReport = async (req, res) => {
    try {
        const { organisationId, eventId } = req.query;

        if (!organisationId) {
            return res.status(400).json({ error: "organisationId is required" });
        }

        if (!eventId) {
            return res.status(400).json({ error: "eventId is required" });
        }

        // Fetch organisation details
        const organisation = await Organisation.findById(organisationId);
        if (!organisation) {
            return res.status(404).json({ error: "Organisation not found" });
        }

        // Fetch event details
        const event = await Event.findById(eventId);
        let eventName = "MonRobot Challenge 2026";
        let eventCode = "MN2026";
        if (event) {
            eventName = event.name || eventName;
            eventCode = event.eventCode || eventCode;
        } else {
            return res.status(404).json({ error: "Event not found" });
        }

        // Fetch teams for this organisation AND event with approved payments
        const teams = await Team.find({
            organisationId: organisationId,
            eventId: eventId,
            status: "active"
        })
            .populate({
                path: "paymentId",
                select: "_id status"
            })
            .populate({
                path: "contestantIds",
                select: "_id contestantId ner ovog email phoneNumber"
            })
            .populate({
                path: "coachId",
                select: "_id coachId ner ovog email phoneNumber"
            });

        // Filter teams with approved payments
        const approvedTeams = teams.filter(team => 
            team.paymentId && team.paymentId.status === "approved"
        );

        // Collect unique members (contestants) and coaches from approved teams
        const membersMap = new Map();
        const coachesMap = new Map();
        const teamsList = [];

        approvedTeams.forEach(team => {
            const memberIds = team.contestantIds
                .map(member => member.contestantId)
                .join(", ");

            teamsList.push({
                teamId: team.teamId,
                robotName: team.robotName,
                memberIds: memberIds,
                contestants: team.contestantIds,
                coachId: team.coachId
            });

            // Add members to map
            team.contestantIds.forEach(contestant => {
                if (contestant.contestantId && !membersMap.has(contestant.contestantId)) {
                    membersMap.set(contestant.contestantId, {
                        contestantId: contestant.contestantId,
                        ner: contestant.ner,
                        ovog: contestant.ovog,
                        fullName: `${contestant.ner} ${contestant.ovog}`.trim(),
                        email: contestant.email,
                        phoneNumber: contestant.phoneNumber,
                        teams: []
                    });
                }
            });

            // Add coaches to map
            if (team.coachId && team.coachId.coachId) {
                if (!coachesMap.has(team.coachId.coachId)) {
                    coachesMap.set(team.coachId.coachId, {
                        coachId: team.coachId.coachId,
                        ner: team.coachId.ner,
                        ovog: team.coachId.ovog,
                        fullName: `${team.coachId.ner} ${team.coachId.ovog}`.trim(),
                        email: team.coachId.email,
                        phoneNumber: team.coachId.phoneNumber,
                        teams: []
                    });
                }
            }
        });

        // Map members and coaches to their teams
        teamsList.forEach(team => {
            team.contestants.forEach(contestant => {
                const memberData = membersMap.get(contestant.contestantId);
                if (memberData && !memberData.teams.includes(team.teamId)) {
                    memberData.teams.push(team.teamId);
                }
            });

            // Map coach to team
            if (team.coachId && team.coachId.coachId) {
                const coachData = coachesMap.get(team.coachId.coachId);
                if (coachData && !coachData.teams.includes(team.teamId)) {
                    coachData.teams.push(team.teamId);
                }
            }
        });

        // Prepare response with structured data
        res.json({
            event: {
                name: eventName,
                code: eventCode,
            },
            organisation: {
                id: organisation.organisationId,
                name: organisation.typeDetail,
                type: organisation.type,
                aimag: organisation.aimag,
            },
            summary: {
                totalMembers: membersMap.size,
                totalTeams: teamsList.length,
            },
            teams: teamsList,
            members: Array.from(membersMap.values()),
            coaches: Array.from(coachesMap.values())
        });
    } catch (error) {
        console.error("Error exporting organisation report:", error.message);
        res.status(500).json({ error: "Failed to export organisation report" });
    }
};
