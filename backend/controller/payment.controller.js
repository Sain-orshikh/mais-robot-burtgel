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

        // Block resubmission for rejected registrations (must create new teams)
        const rejectedRegistration = await Event.findOne({
            _id: eventId,
            registrations: {
                $elemMatch: {
                    status: "rejected",
                    teamIds: { $in: teamIds },
                },
            },
        }).select("_id");

        if (rejectedRegistration) {
            return res.status(409).json({
                error: "This registration was rejected. Please create new teams and submit again. If you already paid, request a refund.",
            });
        }

        // Check if any of these teams are already paid for
        const alreadyPaidTeams = teams.filter(team => team.paymentId);
        if (alreadyPaidTeams.length > 0) {
            return res.status(400).json({ error: "Some teams are already included in a payment" });
        }

        // Guard: ensure all teams are still unpaid at the time of submission
        const unpaidCount = await Team.countDocuments({
            _id: { $in: teamIds },
            organisationId,
            eventId,
            paymentId: { $in: [null, undefined] },
        });

        if (unpaidCount !== teamIds.length) {
            return res.status(409).json({ error: "Some teams were paid in another request" });
        }

        const payment = await Payment.create({
            organisationId,
            eventId,
            receiptUrl,
            amount,
            teamIds,
            status: "pending",
        });

        // Update teams to reference this payment (only if still unpaid)
        const teamUpdateResult = await Team.updateMany(
            { _id: { $in: teamIds }, paymentId: { $in: [null, undefined] } },
            { $set: { paymentId: payment._id } }
        );

        if (teamUpdateResult.modifiedCount !== teamIds.length) {
            // Roll back payment if teams were linked by another request
            await Payment.deleteOne({ _id: payment._id });
            return res.status(409).json({ error: "Payment already submitted for some teams" });
        }

        // Create a single grouped registration for this payment
        const event = await Event.findById(eventId);

        if (event) {
            const categories = Array.from(
                new Set(
                    teams.map((team) => team.categoryCode || team.categoryName).filter(Boolean)
                )
            );

            // Avoid duplicate grouped registrations for the same payment or teams
            const existingGrouped = await Event.findOne({
                _id: eventId,
                $or: [
                    { registrations: { $elemMatch: { paymentId: payment._id, status: { $ne: "rejected" } } } },
                    { registrations: { $elemMatch: { teamIds: { $in: teamIds }, status: { $ne: "rejected" } } } },
                ],
            }).select("_id");

            if (!existingGrouped) {
                await Event.updateOne(
                    { _id: eventId },
                    {
                        $push: {
                            registrations: {
                                organisationId,
                                teamIds,
                                categories,
                                paymentId: payment._id,
                                status: "pending",
                            },
                        },
                    }
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
