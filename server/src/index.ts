import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import { config } from "./config";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundHandler } from "./middleware/notFoundHandler";
import { authRouter } from "./routes/auth";
import { documentsRouter } from "./routes/documents";
import { reportsRouter } from "./routes/reports";
import { ticketsRouter } from "./routes/tickets";
import morgan from 'morgan';
import { config as dotenvConfig } from 'dotenv';
import apiRoutes from './routes/api';

// Load environment variables
dotenvConfig();

export const app = express();
const port = process.env.PORT || 3005;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression
app.use(compression());

// Route-specific rate limiting
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window per IP
    message: "Too many login attempts, please try again later",
});

const apiLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
});

// Apply rate limiting
app.use("/api/auth/login", authLimiter);
app.use("/api", apiLimiter);

// API versioning prefix
const API_V1 = "/api/v1";

// Routes
app.use(`${API_V1}/auth`, authRouter);
app.use(`${API_V1}/documents`, documentsRouter);
app.use(`${API_V1}/reports`, reportsRouter);
app.use(`${API_V1}/tickets`, ticketsRouter);

// Health check
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
    });
});

// API routes
app.use('/api', apiRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📝 Environment: ${config.nodeEnv}`);
    console.log(`🔒 CORS enabled for: ${config.corsOrigin}`);
    console.log(`📚 API Version: v1`);
});
