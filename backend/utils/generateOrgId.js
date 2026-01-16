import Counter from "../models/counter.model.js";

/**
 * Generates a unique organisation ID using atomic MongoDB operations
 * Format: MN00001, MN00002, etc.
 * This function is safe for concurrent registrations
 */
export const getNextOrganisationId = async () => {
    try {
        // Use findOneAndUpdate with upsert and increment atomically
        // This ensures no two requests get the same ID even if they happen simultaneously
        const counter = await Counter.findOneAndUpdate(
            { _id: "organisationId" },
            { $inc: { sequence_value: 1 } },
            { 
                new: true, // Return the updated document
                upsert: true, // Create if doesn't exist
                setDefaultsOnInsert: true // Set defaults when creating
            }
        );

        // Format the ID: MN + 5-digit zero-padded number
        const idNumber = counter.sequence_value;
        const formattedId = `MN${String(idNumber).padStart(5, '0')}`;
        
        return formattedId;
    } catch (error) {
        console.error("Error generating organisation ID:", error);
        throw new Error("Failed to generate organisation ID");
    }
};
