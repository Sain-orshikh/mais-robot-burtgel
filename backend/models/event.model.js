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
        registrationStart: {
            type: Date,
            required: true,
        },
        registrationEnd: {
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
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual field to compute event status based on dates
eventSchema.virtual('status').get(function() {
    const now = new Date();
    
    if (now < this.registrationStart) {
        return 'upcoming'; // Before registration opens
    } else if (now >= this.registrationStart && now < this.registrationEnd) {
        return 'registration-open'; // Registration is open
    } else if (now >= this.registrationEnd && now < this.startDate) {
        return 'registration-closed'; // Registration closed, event not started
    } else if (now >= this.startDate && now < this.endDate) {
        return 'ongoing'; // Event is happening
    } else {
        return 'completed'; // Event has ended
    }
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
