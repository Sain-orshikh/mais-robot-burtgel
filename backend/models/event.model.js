import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        registrationDeadline: {
            type: Date,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        categories: [
            {
                name: {
                    type: String,
                    required: true,
                },
                description: {
                    type: String,
                },
                maxTeamsPerOrg: {
                    type: Number,
                    default: 1,
                },
                minContestantsPerTeam: {
                    type: Number,
                    default: 1,
                },
                maxContestantsPerTeam: {
                    type: Number,
                    default: 5,
                },
            }
        ],
        registrations: [
            {
                organisationId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Organisation',
                    required: true,
                },
                category: {
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
                registeredAt: {
                    type: Date,
                    default: Date.now,
                },
                status: {
                    type: String,
                    enum: ['pending', 'approved', 'rejected'],
                    default: 'pending',
                }
            }
        ],
        status: {
            type: String,
            enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
            default: 'upcoming',
        },
    },
    { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
