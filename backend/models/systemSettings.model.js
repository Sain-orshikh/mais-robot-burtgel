import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        categoryCode: {
            type: String,
            required: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        maxTeamsPerOrg: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
        },
        minContestantsPerTeam: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
        },
        maxContestantsPerTeam: {
            type: Number,
            required: true,
            min: 1,
            default: 2,
        },
    },
    { _id: false }
);

const systemSettingsSchema = new mongoose.Schema(
    {
        singleton: {
            type: String,
            required: true,
            unique: true,
            default: "global",
        },
        bankName: {
            type: String,
            default: "",
        },
        bankAccountName: {
            type: String,
            default: "",
        },
        bankAccountNumber: {
            type: String,
            default: "",
        },
        loginLogoUrl: {
            type: String,
            default: "/icons/12.jpg",
        },
        availableCategories: {
            type: [categorySchema],
            default: [],
        },
    },
    { timestamps: true }
);

const SystemSettings = mongoose.model("SystemSettings", systemSettingsSchema);

export default SystemSettings;
