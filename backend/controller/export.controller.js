import Team from "../models/team.model.js";
import Contestant from "../models/contestant.model.js";
import Coach from "../models/coach.model.js";
import Organisation from "../models/organisation.model.js";
import Payment from "../models/payment.model.js";
import Event from "../models/event.model.js";

// Export all teams with payment approved status
export const exportTeams = async (req, res) => {
    try {
        const { eventId } = req.query;
        const teamQuery = { status: "active" };
        if (eventId) {
            teamQuery.eventId = eventId;
        }

        // Fetch all teams with populated relations
        const teams = await Team.find(teamQuery)
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
        const { eventId } = req.query;
        const teamQuery = { status: "active" };
        if (eventId) {
            teamQuery.eventId = eventId;
        }

        const teams = await Team.find(teamQuery)
            .populate({ path: "paymentId", select: "_id status" })
            .select("_id teamId contestantIds");

        const approvedTeams = teams.filter(
            (team) => team.paymentId && team.paymentId.status === "approved"
        );

        const contestantIds = Array.from(
            new Set(
                approvedTeams.flatMap((team) =>
                    Array.isArray(team.contestantIds)
                        ? team.contestantIds.map((id) => id.toString())
                        : []
                )
            )
        );

        if (contestantIds.length === 0) {
            return res.json([]);
        }

        const contestants = await Contestant.find({ _id: { $in: contestantIds } })
            .populate({
                path: "organisationId",
                select: "_id typeDetail"
            });

        // Enrich contestants with team IDs
        const enrichedContestants = contestants.map(contestant => {
            const contestantTeams = approvedTeams.filter(team => 
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
                participationCount: contestantTeams.length,
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
        const { eventId } = req.query;
        const teamQuery = { status: "active" };
        if (eventId) {
            teamQuery.eventId = eventId;
        }

        const teams = await Team.find(teamQuery)
            .populate({ path: "paymentId", select: "_id status" })
            .select("_id teamId coachId");

        const approvedTeams = teams.filter(
            (team) => team.paymentId && team.paymentId.status === "approved"
        );

        const coachIds = Array.from(
            new Set(
                approvedTeams
                    .map((team) => team.coachId?.toString())
                    .filter(Boolean)
            )
        );

        if (coachIds.length === 0) {
            return res.json([]);
        }

        const coaches = await Coach.find({ _id: { $in: coachIds } })
            .populate({
                path: "organisationId",
                select: "_id typeDetail"
            });

        // Enrich coaches with team IDs
        const enrichedCoaches = coaches.map(coach => {
            const coachTeams = approvedTeams.filter(
                (team) => team.coachId && team.coachId.toString() === coach._id.toString()
            );
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
                participationCount: coachTeams.length,
            };
        });

        res.json(enrichedCoaches);
    } catch (error) {
        console.error("Error exporting coaches:", error.message);
        res.status(500).json({ error: "Failed to export coaches" });
    }
};

// Export all organisations with detailed team, contestant, and coach information
export const exportOrganisations = async (req, res) => {
    try {
        console.log("\n\n========== EXPORT ORGANISATIONS FUNCTION CALLED ==========");
        const { eventId } = req.query;
        console.log(`📍 Received eventId from query: ${eventId || 'NONE (null/undefined)'}`);
        
        const teamQuery = { status: "active" };
        if (eventId) {
            teamQuery.eventId = eventId;
            console.log(`✓ Adding eventId filter to query: eventId=${eventId}`);
        } else {
            console.log(`⚠️ NO eventId provided - will return teams from ALL events!`);
        }

        // Step 1-6: Query active teams, filter by event, populate payments, filter by approval status, extract unique orgs
        const teams = await Team.find(teamQuery)
            .populate({ path: "paymentId", select: "_id status" })
            .populate({ path: "organisationId", select: "_id organisationId typeDetail type aimag email phoneNumber registriinDugaar ner ovog" })
            .populate({ path: "coachId", select: "_id coachId ner ovog email phoneNumber" })
            .populate({ path: "contestantIds", select: "_id contestantId ner ovog email phoneNumber gender tursunUdur" });
        
        console.log("✓ Teams query completed");

        console.log("Total teams with status='active':", teams.length);
        
        // Log unique eventIds in result (to see if data is mixed)
        const eventIdsInTeams = new Set();
        teams.forEach(team => {
            if (team.eventId) {
                eventIdsInTeams.add(team.eventId.toString());
            } else {
                eventIdsInTeams.add('NO_EVENT_ID');
            }
        });
        console.log(`Unique event IDs in teams result: ${Array.from(eventIdsInTeams).join(', ')}`);

        // Log all payment statuses to see what we have
        const paymentStatuses = new Map();
        teams.forEach(team => {
            const status = team.paymentId?.status || 'NO_PAYMENT';
            paymentStatuses.set(status, (paymentStatuses.get(status) || 0) + 1);
        });
        console.log("Payment statuses in database:", Object.fromEntries(paymentStatuses));

        // Log details of first 3 teams
        teams.slice(0, 3).forEach((team, idx) => {
            console.log(`Team ${idx}:`, {
                teamId: team.teamId,
                robotName: team.robotName,
                hasPaymentId: !!team.paymentId,
                paymentId: team.paymentId?._id?.toString() || 'null',
                paymentStatus: team.paymentId?.status || 'null',
                organisationId: team.organisationId?._id?.toString() || 'null',
                organisationName: team.organisationId?.typeDetail || 'null',
            });
        });

        const approvedTeams = teams.filter(
            (team) => team.paymentId && team.paymentId.status === "approved"
        );

        console.log("Approved teams count (with 'approved' status):", approvedTeams.length);
        
        // If no approved teams found with "approved" status, try fallback statuses
        let teamsToUse = approvedTeams;
        if (approvedTeams.length === 0) {
            console.log("No teams with 'approved' status. Trying fallback statuses...");
            const fallbackStatuses = ["verified", "completed", "paid", "success"];
            for (const status of fallbackStatuses) {
                const fallbackTeams = teams.filter(t => t.paymentId?.status === status);
                if (fallbackTeams.length > 0) {
                    console.log(`Found ${fallbackTeams.length} teams with status: ${status}`);
                    teamsToUse = fallbackTeams;
                    break;
                }
            }
            
            // If still nothing, just use all teams with any payment
            if (teamsToUse.length === 0) {
                console.log("No teams with fallback statuses. Using all teams with any payment.");
                teamsToUse = teams.filter(t => t.paymentId);
            }
        }
        
        console.log("Final teams to use for export:", teamsToUse.length);

        const organisationIds = Array.from(
            new Set(
                teamsToUse
                    .map((team) => team.organisationId?._id?.toString())
                    .filter(Boolean)
            )
        );

        // Log details about teamsToUse
        console.log("TeamsToUse details:");
        teamsToUse.slice(0, 2).forEach((team, idx) => {
            console.log(`  Team ${idx}: id=${team._id}, organisationId=${team.organisationId?._id?.toString()}, hasContestants=${!!team.contestantIds}, coachId=${team.coachId?._id?.toString()}`);
        });

        if (organisationIds.length === 0) {
            return res.json([]);
        }

        const organisations = await Organisation.find({ _id: { $in: organisationIds } });
        
        console.log(`✓ Found ${organisations.length} organisations from IDs: ${organisationIds.join(', ')}`);
        organisations.forEach((org, idx) => {
            console.log(`  Org ${idx}: ID=${org._id}, typeDetail=${org.typeDetail}`);
        });

        console.log("\n=== Starting enrichedOrgs.map() ===");
        // Step 7: Count teams, contestants, and coaches per organization
        const enrichedOrgs = organisations.map((org, mapIndex) => {
            console.log(`\n[MAP ${mapIndex}] Processing Org: ${org.typeDetail} (ID: ${org._id})`);
            
            // STEP 1: Get all teams for this organization
            const orgTeams = teamsToUse.filter(team => {
                const teamOrgId = team.organisationId?._id?.toString();
                const orgId = org._id?.toString();
                const match = teamOrgId === orgId;
                if (match) {
                    console.log(`  ✓ Team matched: ${team.teamId} (eventId: ${team.eventId?.toString() || 'null'})`);
                }
                return match;
            });

            console.log(`  Total teams found for this org: ${orgTeams.length}`);

            // STEP 2: Collect unique contestants from all teams
            const uniqueContestants = new Map();
            orgTeams.forEach(team => {
                if (team.contestantIds && Array.isArray(team.contestantIds)) {
                    team.contestantIds.forEach(contestant => {
                        // Use contestantId field (CT.. format) - system ID given when organization registers
                        const contestantId = contestant.contestantId || contestant._id?.toString();
                        if (contestantId && !uniqueContestants.has(contestantId)) {
                            uniqueContestants.set(contestantId, {
                                contestantId: contestantId,
                                name: `${contestant.ner || ''} ${contestant.ovog || ''}`.trim(),
                                teamIds: [team.teamId || team._id]
                            });
                        } else if (contestantId) {
                            // Add team ID if contestant already exists
                            const existing = uniqueContestants.get(contestantId);
                            if (!existing.teamIds.includes(team.teamId || team._id)) {
                                existing.teamIds.push(team.teamId || team._id);
                            }
                        }
                    });
                }
            });

            console.log(`  Total unique contestants: ${uniqueContestants.size}`);

            // STEP 3: Collect unique coaches from all teams
            const uniqueCoaches = new Map();
            orgTeams.forEach(team => {
                if (team.coachId) {
                    // Use coachId field (CH.. format) - system ID given when organization registers
                    const coachId = team.coachId.coachId || team.coachId._id?.toString();
                    if (coachId && !uniqueCoaches.has(coachId)) {
                        uniqueCoaches.set(coachId, {
                            coachId: coachId,
                            name: `${team.coachId.ner || ''} ${team.coachId.ovog || ''}`.trim(),
                            teamIds: [team.teamId || team._id]
                        });
                    } else if (coachId) {
                        // Add team ID if coach already exists
                        const existing = uniqueCoaches.get(coachId);
                        if (!existing.teamIds.includes(team.teamId || team._id)) {
                            existing.teamIds.push(team.teamId || team._id);
                        }
                    }
                }
            });

            console.log(`  Total unique coaches: ${uniqueCoaches.size}`);

            // Build result object
            const result = {
                _id: org.organisationId || org._id?.toString() || "",
                organisationId: org.organisationId || org._id?.toString() || "",
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
                totalTeams: orgTeams.length,
                totalContestants: uniqueContestants.size,
                totalCoaches: uniqueCoaches.size,
                teams: orgTeams.map(team => ({
                    teamId: (team.teamId || team._id).toString(),
                    robotName: team.robotName || '',
                    memberIds: (team.contestantIds || []).map(c => c.contestantId || c._id?.toString()).filter(Boolean)
                })),
                contestants: Array.from(uniqueContestants.values()).map(c => ({
                    contestantId: c.contestantId.toString(),
                    name: c.name,
                    teamIds: c.teamIds.map(tid => tid.toString())
                })),
                coaches: Array.from(uniqueCoaches.values()).map(c => ({
                    coachId: c.coachId.toString(),
                    name: c.name,
                    teamIds: c.teamIds.map(tid => tid.toString())
                }))
            };

            console.log(`  Result: ${orgTeams.length} teams, ${uniqueContestants.size} contestants, ${uniqueCoaches.size} coaches`);

            return result;
        });

        console.log("\n=== FINAL EXPORT DATA ===");
        console.log("Enriched orgs count:", enrichedOrgs.length);
        if (enrichedOrgs.length > 0) {
            console.log("First org summary:", {
                organisationId: enrichedOrgs[0].organisationId,
                typeDetail: enrichedOrgs[0].typeDetail,
                totalTeams: enrichedOrgs[0].totalTeams,
                totalContestants: enrichedOrgs[0].totalContestants,
                totalCoaches: enrichedOrgs[0].totalCoaches,
                teamsLength: enrichedOrgs[0].teams?.length,
                contestantsLength: enrichedOrgs[0].contestants?.length,
                coachesLength: enrichedOrgs[0].coaches?.length
            });
        }
        console.log("Sending response...");
        res.json(enrichedOrgs);
    } catch (error) {
        console.error("Error exporting organisations:", error.message);
        console.error("Stack:", error.stack);
        res.status(500).json({ error: "Failed to export organisations", details: error.message });
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

// Export organisation report with teams and members (approved payments only)
export const exportOrganisationReport = async (req, res) => {
    try {
        const { organisationId, eventId } = req.query;

        if (!organisationId) {
            return res.status(400).json({ error: "organisationId is required" });
        }

        if (!eventId) {
            return res.status(400).json({ error: "eventId is required" });
        }

        const organisation = await Organisation.findById(organisationId);
        if (!organisation) {
            return res.status(404).json({ error: "Organisation not found" });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        const teams = await Team.find({
            organisationId,
            eventId,
            status: "active",
        })
            .populate({ path: "paymentId", select: "_id status" })
            .populate({
                path: "contestantIds",
                select: "_id contestantId ner ovog email phoneNumber",
            })
            .populate({
                path: "coachId",
                select: "_id coachId ner ovog email phoneNumber",
            });

        const approvedTeams = teams.filter(
            (team) => team.paymentId && team.paymentId.status === "approved"
        );

        const membersMap = new Map();
        const coachesMap = new Map();
        const teamsList = [];

        approvedTeams.forEach((team) => {
            const memberIds = team.contestantIds
                .map((member) => member.contestantId)
                .join(", ");

            teamsList.push({
                teamId: team.teamId,
                robotName: team.robotName,
                memberIds,
                contestants: team.contestantIds,
                coachId: team.coachId,
            });

            team.contestantIds.forEach((contestant) => {
                if (contestant.contestantId && !membersMap.has(contestant.contestantId)) {
                    membersMap.set(contestant.contestantId, {
                        contestantId: contestant.contestantId,
                        ner: contestant.ner,
                        ovog: contestant.ovog,
                        fullName: `${contestant.ner} ${contestant.ovog}`.trim(),
                        email: contestant.email,
                        phoneNumber: contestant.phoneNumber,
                        teams: [],
                    });
                }
            });

            if (team.coachId && team.coachId.coachId && !coachesMap.has(team.coachId.coachId)) {
                coachesMap.set(team.coachId.coachId, {
                    coachId: team.coachId.coachId,
                    ner: team.coachId.ner,
                    ovog: team.coachId.ovog,
                    fullName: `${team.coachId.ner} ${team.coachId.ovog}`.trim(),
                    email: team.coachId.email,
                    phoneNumber: team.coachId.phoneNumber,
                    teams: [],
                });
            }
        });

        teamsList.forEach((team) => {
            team.contestants.forEach((contestant) => {
                const memberData = membersMap.get(contestant.contestantId);
                if (memberData && !memberData.teams.includes(team.teamId)) {
                    memberData.teams.push(team.teamId);
                }
            });

            if (team.coachId && team.coachId.coachId) {
                const coachData = coachesMap.get(team.coachId.coachId);
                if (coachData && !coachData.teams.includes(team.teamId)) {
                    coachData.teams.push(team.teamId);
                }
            }
        });

        res.json({
            event: {
                name: event.name || "MAIS Robot Challenge",
                code: event.eventCode || "EVENT",
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
            coaches: Array.from(coachesMap.values()),
        });
    } catch (error) {
        console.error("Error exporting organisation report:", error.message);
        res.status(500).json({ error: "Failed to export organisation report" });
    }
};
