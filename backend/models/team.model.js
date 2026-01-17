import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
    {
        teamId: {
            type: String,
            unique: true,
            required: true,
        },
        organisationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organisation',
            required: true,
        },
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
            required: true,
        },
        categoryCode: {
            type: String,
            required: true,
            enum: ['MNR', 'MGR', 'MNA', 'MGA', 'RRC', 'DRC', 'DRA', 'LFG', 'LFH', 'LFL', 'LSR', 'LUR'],
        },
        categoryName: {
            type: String,
            required: true,
        },
        robotName: {
            type: String,
            required: true,
        },
        contestantIds: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Contestant',
        }],
        coachId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Coach',
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'withdrawn'],
            default: 'active',
        },
        paymentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Payment',
            default: null,
        },
    },
    { timestamps: true }
);

const Team = mongoose.model("Team", teamSchema);

export default Team;
