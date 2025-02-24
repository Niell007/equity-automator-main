import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { config } from "../config";
import { AppError } from "../middleware/errorHandler";
import { authenticate } from "../middleware/auth";

export const authRouter = Router();

// Validation schemas
const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    fullName: z.string().min(2),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

// Register route
authRouter.post("/register", async (req, res, next) => {
    try {
        const { email, password, fullName } = registerSchema.parse(req.body);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new AppError(409, "User already exists");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                fullName,
                role: "USER",
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
            },
        });

        // Generate token
        const token = jwt.sign({ userId: user.id }, config.jwt.secret, {
            expiresIn: config.jwt.expiresIn,
        });

        res.status(201).json({
            status: "success",
            data: {
                user,
                token,
            },
        });
    } catch (error) {
        next(error);
    }
});

// Login route
authRouter.post("/login", async (req, res, next) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new AppError(401, "Invalid credentials");
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new AppError(401, "Invalid credentials");
        }

        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });

        // Generate token
        const token = jwt.sign({ userId: user.id }, config.jwt.secret, {
            expiresIn: config.jwt.expiresIn,
        });

        const { password: _, ...userWithoutPassword } = user;

        res.json({
            status: "success",
            data: {
                user: userWithoutPassword,
                token,
            },
        });
    } catch (error) {
        next(error);
    }
});

// Get current user route
authRouter.get("/me", authenticate, async (req, res) => {
    res.json({
        status: "success",
        data: {
            user: req.user,
        },
    });
});
