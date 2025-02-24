import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate, authorize } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";

export const documentsRouter = Router();

// Validation schemas
const createDocumentSchema = z.object({
    title: z.string().min(1),
    content: z.string(),
    type: z.enum(["CERTIFICATE", "AFFIDAVIT", "REPORT", "OTHER"]),
    status: z.enum(["DRAFT", "PENDING", "APPROVED", "REJECTED"]).default(
        "DRAFT",
    ),
});

const updateDocumentSchema = createDocumentSchema.partial();

// Middleware
documentsRouter.use(authenticate);

// Get all documents
documentsRouter.get("/", async (req, res, next) => {
    try {
        const documents = await prisma.document.findMany({
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
                documents,
            },
        });
    } catch (error) {
        next(error);
    }
});

// Get document by ID
documentsRouter.get("/:id", async (req, res, next) => {
    try {
        const document = await prisma.document.findUnique({
            where: {
                id: req.params.id,
                userId: req.user!.id,
            },
        });

        if (!document) {
            throw new AppError(404, "Document not found");
        }

        res.json({
            status: "success",
            data: {
                document,
            },
        });
    } catch (error) {
        next(error);
    }
});

// Create document
documentsRouter.post("/", async (req, res, next) => {
    try {
        const data = createDocumentSchema.parse(req.body);

        const document = await prisma.document.create({
            data: {
                ...data,
                userId: req.user!.id,
            },
        });

        res.status(201).json({
            status: "success",
            data: {
                document,
            },
        });
    } catch (error) {
        next(error);
    }
});

// Update document
documentsRouter.patch("/:id", async (req, res, next) => {
    try {
        const data = updateDocumentSchema.parse(req.body);

        const document = await prisma.document.findUnique({
            where: {
                id: req.params.id,
                userId: req.user!.id,
            },
        });

        if (!document) {
            throw new AppError(404, "Document not found");
        }

        const updatedDocument = await prisma.document.update({
            where: {
                id: req.params.id,
            },
            data,
        });

        res.json({
            status: "success",
            data: {
                document: updatedDocument,
            },
        });
    } catch (error) {
        next(error);
    }
});

// Delete document
documentsRouter.delete("/:id", async (req, res, next) => {
    try {
        const document = await prisma.document.findUnique({
            where: {
                id: req.params.id,
                userId: req.user!.id,
            },
        });

        if (!document) {
            throw new AppError(404, "Document not found");
        }

        await prisma.document.delete({
            where: {
                id: req.params.id,
            },
        });

        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

// Review document (admin only)
documentsRouter.post(
    "/:id/review",
    authorize("ADMIN"),
    async (req, res, next) => {
        try {
            const { status } = z
                .object({
                    status: z.enum(["APPROVED", "REJECTED"]),
                })
                .parse(req.body);

            const document = await prisma.document.update({
                where: {
                    id: req.params.id,
                },
                data: {
                    status,
                    reviewedAt: new Date(),
                    reviewerId: req.user!.id,
                },
            });

            res.json({
                status: "success",
                data: {
                    document,
                },
            });
        } catch (error) {
            next(error);
        }
    },
);
