import SystemSettings from "../models/systemSettings.model.js";

const DEFAULT_CATEGORIES = [
    { categoryCode: "MNR", name: "Mini Sumo RC", maxTeamsPerOrg: 10, minContestantsPerTeam: 1, maxContestantsPerTeam: 2 },
    { categoryCode: "MGR", name: "Mega Sumo RC", maxTeamsPerOrg: 10, minContestantsPerTeam: 1, maxContestantsPerTeam: 2 },
    { categoryCode: "MNA", name: "Mini Sumo Auto", maxTeamsPerOrg: 10, minContestantsPerTeam: 1, maxContestantsPerTeam: 2 },
    { categoryCode: "MGA", name: "Mega Sumo Auto", maxTeamsPerOrg: 10, minContestantsPerTeam: 1, maxContestantsPerTeam: 2 },
    { categoryCode: "RRC", name: "Robot Rugby", maxTeamsPerOrg: 10, minContestantsPerTeam: 1, maxContestantsPerTeam: 4 },
    { categoryCode: "DRC", name: "Drone RC", maxTeamsPerOrg: 5, minContestantsPerTeam: 1, maxContestantsPerTeam: 2 },
    { categoryCode: "DRA", name: "Drone Auto", maxTeamsPerOrg: 5, minContestantsPerTeam: 1, maxContestantsPerTeam: 2 },
    { categoryCode: "LFG", name: "Line Follower (Lego)", maxTeamsPerOrg: 10, minContestantsPerTeam: 1, maxContestantsPerTeam: 2 },
    { categoryCode: "LFH", name: "Line Follower (High Speed)", maxTeamsPerOrg: 10, minContestantsPerTeam: 1, maxContestantsPerTeam: 2 },
    { categoryCode: "LFL", name: "Line Follower (Low Speed)", maxTeamsPerOrg: 10, minContestantsPerTeam: 1, maxContestantsPerTeam: 2 },
    { categoryCode: "LSR", name: "Lego Sumo", maxTeamsPerOrg: 10, minContestantsPerTeam: 1, maxContestantsPerTeam: 2 },
    { categoryCode: "LUR", name: "Lego Unknown", maxTeamsPerOrg: 10, minContestantsPerTeam: 1, maxContestantsPerTeam: 3 },
];

const mapFromEnv = () => ({
    bankName: process.env.VITE_BANK_NAME || "",
    bankAccountName: process.env.VITE_BANK_ACCOUNT_NAME || "",
    bankAccountNumber: process.env.VITE_BANK_ACCOUNT_NUMBER || "",
    loginLogoUrl: process.env.VITE_LOGIN_LOGO_URL || "/icons/12.jpg",
    availableCategories: DEFAULT_CATEGORIES,
});

const getOrCreateSettings = async () => {
    let settings = await SystemSettings.findOne({ singleton: "global" });

    if (!settings) {
        settings = await SystemSettings.create({
            singleton: "global",
            ...mapFromEnv(),
        });
    }

    return settings;
};

export const getPublicSettings = async (_req, res) => {
    try {
        const settings = await getOrCreateSettings();

        res.status(200).json({
            bankName: settings.bankName,
            bankAccountName: settings.bankAccountName,
            bankAccountNumber: settings.bankAccountNumber,
            loginLogoUrl: settings.loginLogoUrl,
            availableCategories: settings.availableCategories,
        });
    } catch (error) {
        console.log("Error in getPublicSettings controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getAdminSettings = async (_req, res) => {
    try {
        const settings = await getOrCreateSettings();
        res.status(200).json(settings);
    } catch (error) {
        console.log("Error in getAdminSettings controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateAdminSettings = async (req, res) => {
    try {
        const {
            bankName,
            bankAccountName,
            bankAccountNumber,
            loginLogoUrl,
            availableCategories,
        } = req.body;

        const updates = {};

        if (typeof bankName === "string") updates.bankName = bankName;
        if (typeof bankAccountName === "string") updates.bankAccountName = bankAccountName;
        if (typeof bankAccountNumber === "string") updates.bankAccountNumber = bankAccountNumber;
        if (typeof loginLogoUrl === "string") updates.loginLogoUrl = loginLogoUrl;

        if (Array.isArray(availableCategories)) {
            const normalized = availableCategories
                .map((cat) => ({
                    categoryCode: String(cat.categoryCode || "").trim().toUpperCase(),
                    name: String(cat.name || "").trim(),
                    maxTeamsPerOrg: Number(cat.maxTeamsPerOrg || 1),
                    minContestantsPerTeam: Number(cat.minContestantsPerTeam || 1),
                    maxContestantsPerTeam: Number(cat.maxContestantsPerTeam || 1),
                }))
                .filter((cat) => cat.categoryCode && cat.name)
                .filter((cat) => cat.maxContestantsPerTeam >= cat.minContestantsPerTeam);

            const uniqueCodes = new Set(normalized.map((cat) => cat.categoryCode));
            if (uniqueCodes.size !== normalized.length) {
                return res.status(400).json({ error: "Category codes must be unique" });
            }

            updates.availableCategories = normalized;
        }

        const settings = await SystemSettings.findOneAndUpdate(
            { singleton: "global" },
            { $set: updates, $setOnInsert: { singleton: "global", ...mapFromEnv() } },
            { new: true, upsert: true }
        );

        res.status(200).json(settings);
    } catch (error) {
        console.log("Error in updateAdminSettings controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
