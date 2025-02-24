import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Starting seeding...");

        // Create admin user
        const adminPassword = await bcrypt.hash("admin123", 12);
        const admin = await prisma.user.upsert({
            where: { email: "admin@example.com" },
            update: {},
            create: {
                email: "admin@example.com",
                password: adminPassword,
                fullName: "Admin User",
                role: "ADMIN",
                status: "active",
            },
        });
        console.log("Created admin user:", admin.email);

        // Create regular user
        const userPassword = await bcrypt.hash("user123", 12);
        const user = await prisma.user.upsert({
            where: { email: "user@example.com" },
            update: {},
            create: {
                email: "user@example.com",
                password: userPassword,
                fullName: "Regular User",
                role: "USER",
                status: "active",
            },
        });
        console.log("Created regular user:", user.email);

        // Create sample documents
        const documents = await Promise.all([
            prisma.document.create({
                data: {
                    title: "B-BBEE Certificate 2024",
                    content: "Sample B-BBEE certificate content",
                    status: "published",
                    type: "CERTIFICATE",
                    userId: user.id,
                },
            }),
            prisma.document.create({
                data: {
                    title: "Compliance Report Draft",
                    content: "Draft compliance report content",
                    status: "draft",
                    type: "REPORT",
                    userId: user.id,
                },
            }),
        ]);
        console.log("Created sample documents:", documents.length);

        // Create sample reports
        const reports = await Promise.all([
            prisma.report.create({
                data: {
                    title: "Monthly Compliance Report",
                    content: JSON.stringify({
                        period: "January 2024",
                        status: "Compliant",
                        score: 85,
                    }),
                    status: "published",
                    type: "COMPLIANCE",
                    userId: admin.id,
                },
            }),
            prisma.report.create({
                data: {
                    title: "Quarterly Progress Report",
                    content: JSON.stringify({
                        period: "Q1 2024",
                        progress: "On Track",
                        metrics: {
                            ownership: 90,
                            management: 85,
                            skills: 75,
                        },
                    }),
                    status: "pending",
                    type: "PROGRESS",
                    userId: admin.id,
                },
            }),
        ]);
        console.log("Created sample reports:", reports.length);

        // Create sample support tickets
        const tickets = await Promise.all([
            prisma.ticket.create({
                data: {
                    title: "Need help with document upload",
                    description: "I am unable to upload my B-BBEE certificate",
                    status: "open",
                    priority: "high",
                    userId: user.id,
                    messages: {
                        create: [
                            {
                                content:
                                    "I keep getting an error when trying to upload my certificate",
                                userId: user.id,
                            },
                            {
                                content:
                                    "Please provide more details about the error message",
                                userId: admin.id,
                            },
                        ],
                    },
                },
            }),
            prisma.ticket.create({
                data: {
                    title: "Report generation issue",
                    description:
                        "The compliance report is not showing the correct data",
                    status: "in_progress",
                    priority: "medium",
                    userId: user.id,
                    messages: {
                        create: [
                            {
                                content:
                                    "The ownership scores are not being calculated correctly",
                                userId: user.id,
                            },
                        ],
                    },
                },
            }),
        ]);
        console.log("Created sample tickets:", tickets.length);

        console.log("Seeding completed successfully!");
    } catch (error) {
        console.error("Error during seeding:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
