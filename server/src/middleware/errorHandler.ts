import { NextFunction, Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export class AppError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public isOperational = true,
    ) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: "error",
            message: err.message,
            ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
        });
    }

    if (err instanceof PrismaClientKnownRequestError) {
        // Handle Prisma-specific errors
        switch (err.code) {
            case "P2002":
                return res.status(409).json({
                    status: "error",
                    message:
                        "A unique constraint would be violated on this operation.",
                });
            case "P2025":
                return res.status(404).json({
                    status: "error",
                    message: "Record not found.",
                });
            default:
                console.error("Prisma Error:", err);
                return res.status(500).json({
                    status: "error",
                    message: "Database operation failed.",
                });
        }
    }

    // Handle unknown errors
    console.error("Unhandled Error:", err);
    return res.status(500).json({
        status: "error",
        message: "Internal server error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};
