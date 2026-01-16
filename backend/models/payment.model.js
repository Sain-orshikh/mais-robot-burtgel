import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        organisationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organisation",
            required: true,
        },
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
        },
        receiptUrl: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        teamIds: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
        }],
        submittedAt: {
            type: Date,
            default: Date.now,
        },
        reviewedAt: {
            type: Date,
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
        },
        notes: {
            type: String,
        },
    },
    { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
