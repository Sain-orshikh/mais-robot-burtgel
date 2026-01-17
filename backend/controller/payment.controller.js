import Payment from "../models/payment.model.js";
import Team from "../models/team.model.js";
import Event from "../models/event.model.js";

// Submit payment for event registration
export const submitPayment = async (req, res) => {
    try {
        const { eventId, receiptUrl, teamIds, amount } = req.body;
        const organisationId = req.organisation._id;

        // Verify all teams belong to this organization
        const teams = await Team.find({
            _id: { $in: teamIds },
            organisationId,
            eventId,
        });

        if (teams.length !== teamIds.length) {
            return res.status(400).json({ error: "Invalid teams" });
        }

        // Check if any of these teams are already paid for
        const alreadyPaidTeams = teams.filter(team => team.paymentId);
        if (alreadyPaidTeams.length > 0) {
            return res.status(400).json({ error: "Some teams are already included in a payment" });
        }

        const payment = await Payment.create({
            organisationId,
            eventId,
            receiptUrl,
            amount,
            teamIds,
            status: "pending",
        });

        // Update teams to reference this payment
        await Team.updateMany(
            { _id: { $in: teamIds } },
            { $set: { paymentId: payment._id } }
        );

        // Create registrations for paid teams (if not already registered)
        const event = await Event.findById(eventId);

        if (event) {
            const existingTeamIds = new Set(
                (event.registrations || [])
                    .map((reg) => reg.teamId)
                    .filter(Boolean)
                    .map((id) => id.toString())
            );

            const teamsToRegister = teams.filter((team) => !existingTeamIds.has(team._id.toString()));

            if (teamsToRegister.length > 0) {
                const newRegistrations = teamsToRegister.map((team) => ({
                    organisationId,
                    category: team.categoryCode || team.categoryName,
                    contestantIds: team.contestantIds,
                    coachId: team.coachId,
                    teamId: team._id,
                    status: "pending",
                }));

                await Event.updateOne(
                    { _id: eventId },
                    { $push: { registrations: { $each: newRegistrations } } }
                );
            }
        }

        res.status(201).json({ message: "Payment submitted successfully", payment });
    } catch (error) {
        console.log("Error in submitPayment controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get payment status for an event
export const getPaymentStatus = async (req, res) => {
    try {
        const { eventId } = req.params;
        const organisationId = req.organisation._id;

        const payments = await Payment.find({ organisationId, eventId }).sort({ submittedAt: -1 });

        res.status(200).json(payments);
    } catch (error) {
        console.log("Error in getPaymentStatus controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get all payments (admin)
export const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate("organisationId", "organisationId typeDetail")
            .populate("eventId", "name")
            .sort({ submittedAt: -1 });

        res.status(200).json(payments);
    } catch (error) {
        console.log("Error in getAllPayments controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Update payment status (admin)
export const updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;
        const adminId = req.admin._id;

        const payment = await Payment.findByIdAndUpdate(
            id,
            {
                status,
                notes,
                reviewedAt: Date.now(),
                reviewedBy: adminId,
            },
            { new: true }
        );

        if (!payment) {
            return res.status(404).json({ error: "Payment not found" });
        }

        res.status(200).json({ message: "Payment status updated", payment });
    } catch (error) {
        console.log("Error in updatePaymentStatus controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
