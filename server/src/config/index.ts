import "dotenv/config";

interface Config {
    nodeEnv: string;
    port: number;
    corsOrigin: string;
    rateLimit: {
        windowMs: number;
        maxRequests: number;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    database: {
        url: string;
    };
}

export const config: Config = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: parseInt(process.env.PORT || "3005", 10),
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // 15 minutes
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
    },
    jwt: {
        secret: process.env.JWT_SECRET || "your-secret-key",
        expiresIn: process.env.JWT_EXPIRY || "24h",
    },
    database: {
        url: process.env.DATABASE_URL ||
            "postgresql://postgres:postgres@localhost:5432/equity_db",
    },
};
