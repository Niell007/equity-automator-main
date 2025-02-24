import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../src/config";

export const prisma = new PrismaClient();

export const testUsers = {
    admin: {
        email: "test.admin@example.com",
        password: "admin123",
        fullName: "Test Admin",
        role: "ADMIN",
    },
    user: {
        email: "test.user@example.com",
        password: "user123",
        fullName: "Test User",
        role: "USER",
    },
};

export async function setupTestDb() {
    // Clear existing data
    await prisma.message.deleteMany();
    await prisma.ticket.deleteMany();
    await prisma.report.deleteMany();
    await prisma.document.deleteMany();
    await prisma.user.deleteMany();

    // Create test users
    const admin = await prisma.user.create({
        data: {
            email: testUsers.admin.email,
            password: await bcrypt.hash(testUsers.admin.password, 12),
            fullName: testUsers.admin.fullName,
            role: testUsers.admin.role,
            status: "active",
        },
    });

    const user = await prisma.user.create({
        data: {
            email: testUsers.user.email,
            password: await bcrypt.hash(testUsers.user.password, 12),
            fullName: testUsers.user.fullName,
            role: testUsers.user.role,
            status: "active",
        },
    });

    return { admin, user };
}

export function generateAuthToken(userId: string): string {
    return jwt.sign({ userId }, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
    });
}

export async function cleanupTestDb() {
    await prisma.message.deleteMany();
    await prisma.ticket.deleteMany();
    await prisma.report.deleteMany();
    await prisma.document.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
}

export function createAuthHeader(token: string): { Authorization: string } {
    return { Authorization: `Bearer ${token}` };
}
