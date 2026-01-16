import Counter from "../models/counter.model.js";

// Generate next contestant ID (CT0001, CT0002, etc.)
export const getNextContestantId = async () => {
    const counter = await Counter.findOneAndUpdate(
        { _id: "contestantId" },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
    );

    const paddedNumber = String(counter.sequence_value).padStart(4, '0');
    return `CT${paddedNumber}`;
};

// Generate next coach ID (CH0001, CH0002, etc.)
export const getNextCoachId = async () => {
    const counter = await Counter.findOneAndUpdate(
        { _id: "coachId" },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
    );

    const paddedNumber = String(counter.sequence_value).padStart(4, '0');
    return `CH${paddedNumber}`;
};

// Generate next team ID for a specific category (TMNR0001, TMNR0002, etc.)
export const getNextTeamId = async (categoryCode) => {
    const counterId = `teamId_${categoryCode}`;
    
    const counter = await Counter.findOneAndUpdate(
        { _id: counterId },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
    );

    const paddedNumber = String(counter.sequence_value).padStart(4, '0');
    return `T${categoryCode}${paddedNumber}`;
};
