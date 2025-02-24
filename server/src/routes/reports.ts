import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate, authorize } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";

export const reportsRouter = Router();

// Validation schemas
const createReportSchema = z.object({
    title: z.string().min(1),
    content: z.string(),
    type: z.enum(["COMPLIANCE", "PROGRESS", "AUDIT", "OTHER"]),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
});

const updateReportSchema = createReportSchema.partial();

// Middleware
reportsRouter.use(authenticate);

// Get all reports
reportsRouter.get("/", async (req, res, next) => {
    try {
        const reports = await prisma.report.findMany({
            where: {
                userId: req.user!.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.json({
            status: "success",
            data: {
                reports,
            },
        });
    } catch (error) {
        next(error);
    }
});

// Get report by ID
reportsRouter.get("/:id", async (req, res, next) => {
    try {
        const report = await prisma.report.findUnique({
            where: {
                id: req.params.id,
                userId: req.user!.id,
            },
        });

        if (!report) {
            throw new AppError(404, "Report not found");
        }

        res.json({
            status: "success",
            data: {
                report,
            },
        });
    } catch (error) {
        next(error);
    }
});

// Create report
reportsRouter.post("/", async (req, res, next) => {
    try {
        const data = createReportSchema.parse(req.body);

        const report = await prisma.report.create({
            data: {
                ...data,
                userId: req.user!.id,
            },
        });

        res.status(201).json({
            status: "success",
            data: {
                report,
            },
        });
    } catch (error) {
        next(error);
    }
});

// Update report
reportsRouter.patch("/:id", async (req, res, next) => {
    try {
        const data = updateReportSchema.parse(req.body);

        const report = await prisma.report.findUnique({
            where: {
                id: req.params.id,
                userId: req.user!.id,
            },
        });

        if (!report) {
            throw new AppError(404, "Report not found");
        }

        const updatedReport = await prisma.report.update({
            where: {
                id: req.params.id,
            },
            data,
        });

        res.json({
            status: "success",
            data: {
                report: updatedReport,
            },
        });
    } catch (error) {
        next(error);
    }
});

// Delete report
reportsRouter.delete("/:id", async (req, res, next) => {
    try {
        const report = await prisma.report.findUnique({
            where: {
                id: req.params.id,
                userId: req.user!.id,
            },
        });

        if (!report) {
            throw new AppError(404, "Report not found");
        }

        await prisma.report.delete({
            where: {
                id: req.params.id,
            },
        });

        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

// Generate compliance report (admin only)
reportsRouter.post(
    "/generate/compliance",
    authorize("ADMIN"),
    async (req, res, next) => {
        try {
            const { startDate, endDate } = z
                .object({
                    startDate: z.string().datetime(),
                    endDate: z.string().datetime(),
                })
                .parse(req.body);

            // Get compliance statistics
            const stats = await prisma.document.groupBy({
                by: ["status"],
                where: {
                    createdAt: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                    type: "CERTIFICATE",
                },
                _count: true,
            });

            // Create compliance report
            const report = await prisma.report.create({
                data: {
                    title: "Compliance Report",
                    content: JSON.stringify({
                        period: { startDate, endDate },
                        statistics: stats,
                    }),
                    type: "COMPLIANCE",
                    status: "PUBLISHED",
                    userId: req.user!.id,
                },
            });

            res.status(201).json({
                status: "success",
                data: {
                    report,
                },
            });
        } catch (error) {
            next(error);
        }
    },
);
