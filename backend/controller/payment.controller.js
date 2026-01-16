import Payment from "../models/payment.model.js";
import Team from "../models/team.model.js";

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

        // Check if payment already exists for this event
        const existingPayment = await Payment.findOne({ organisationId, eventId });
        if (existingPayment) {
            return res.status(400).json({ error: "Payment already submitted for this event" });
        }

        const payment = await Payment.create({
            organisationId,
            eventId,
            receiptUrl,
            amount,
            teamIds,
            status: "pending",
        });

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

        const payment = await Payment.findOne({ organisationId, eventId });

        if (!payment) {
            return res.status(404).json({ error: "No payment found" });
        }

        res.status(200).json(payment);
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
