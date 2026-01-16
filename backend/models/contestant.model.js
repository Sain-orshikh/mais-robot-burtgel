import mongoose from "mongoose";

const contestantSchema = new mongoose.Schema(
    {
        contestantId: {
            type: String,
            unique: true,
            required: true,
        },
        ovog: {
            type: String,
            required: true,
        },
        ner: {
            type: String,
            required: true,
        },
        register: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        tursunUdur: {
            type: Date,
            required: true,
        },
        gender: {
            type: String,
            enum: ['male', 'female'],
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        organisationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organisation',
            required: true,
        },
        participations: [
            {
                eventId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Event',
                },
                category: {
                    type: String,
                },
                registeredAt: {
                    type: Date,
                    default: Date.now,
                }
            }
        ],
    },
    { timestamps: true }
);

const Contestant = mongoose.model("Contestant", contestantSchema);

export default Contestant;
