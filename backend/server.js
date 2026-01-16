import path from "path";
import express from "express";
import dotenv from "dotenv";
import {v2 as cloudinary} from "cloudinary";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js";
import organisationRoutes from "./routes/organisation.route.js";
import contestantRoutes from "./routes/contestant.route.js";
import coachRoutes from "./routes/coach.route.js";
import eventRoutes from "./routes/event.route.js";
import teamRoutes from "./routes/team.route.js";
import paymentRoutes from "./routes/payment.route.js";
import connectMongoDB from "./db/connectMongoDB.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Configure Cloudinary with WEBP B credentials for news
cloudinary.config({
    cloud_name: process.env.VITE_CLOUDINARY_ALUMNI_WEBP_B_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_ALUMNI_WEBP_B_API_KEY,
    api_secret: process.env.CLOUDINARY_ALUMNI_WEBP_B_API_SECRET,
}); 

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - allow frontend to access backend
const allowedOrigins = [
    "http://localhost:3000",
    "https://mais-robot-burtgel.vercel.app",
    "https://robot-challenge.com",
    "https://www.robot-challenge.com",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('CORS policy violation'), false);
        }
        return callback(null, true);
    },
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
}));

app.use(express.json({limit: "5mb"})); // to parse req.body
app.use(express.urlencoded({ extended: true })); // to parse form data
app.use(cookieParser());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/organisations', organisationRoutes);
app.use('/api/contestants', contestantRoutes);
app.use('/api/coaches', coachRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/payments', paymentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'MAIS Robot Backend Server Running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectMongoDB();
});
