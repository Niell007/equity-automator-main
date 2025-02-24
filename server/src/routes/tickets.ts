import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate, authorize } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";

export const ticketsRouter = Router();

// Validation schemas
const createTicketSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
});

const updateTicketSchema = z.object({
    status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
});

const createMessageSchema = z.object({
    content: z.string().min(1),
});

// Middleware
ticketsRouter.use(authenticate);

// Get all tickets
ticketsRouter.get("/", async (req, res, next) => {
    try {
        const tickets = await prisma.ticket.findMany({
            where: {
                OR: [
                    { userId: req.user!.id },
                    { assigneeId: req.user!.id },
                ],
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    },
                },
                assignee: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    },
                },
                _count: {
                    select: {
                        messages: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.json({
            status: "success",
            data: {
                tickets,
            },
        });
    } catch (error) {
        next(error);
    }
});

// Get ticket by ID
ticketsRouter.get("/:id", async (req, res, next) => {
    try {
        const ticket = await prisma.ticket.findUnique({
            where: {
                id: req.params.id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    },
                },
                assignee: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    },
                },
                messages: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                fullName: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
        });

        if (!ticket) {
            throw new AppError(404, "Ticket not found");
        }

        // Check if user has access to the ticket
        if (
            ticket.userId !== req.user!.id && ticket.assigneeId !== req.user!.id
        ) {
            throw new AppError(403, "You do not have access to this ticket");
        }

        res.json({
            status: "success",
            data: {
                ticket,
            },
        });
    } catch (error) {
        next(error);
    }
});

// Create ticket
ticketsRouter.post("/", async (req, res, next) => {
    try {
        const data = createTicketSchema.parse(req.body);

        const ticket = await prisma.ticket.create({
            data: {
                ...data,
                status: "OPEN",
                userId: req.user!.id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    },
                },
            },
        });

        res.status(201).json({
            status: "success",
            data: {
                ticket,
            },
        });
    } catch (error) {
        next(error);
    }
});

// Update ticket status (admin only)
ticketsRouter.patch(
    "/:id/status",
    authorize("ADMIN"),
    async (req, res, next) => {
        try {
            const { status } = updateTicketSchema.parse(req.body);

            const ticket = await prisma.ticket.update({
                where: {
                    id: req.params.id,
                },
                data: {
                    status,
                    assigneeId: req.user!.id,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            fullName: true,
                        },
                    },
                    assignee: {
                        select: {
                            id: true,
                            email: true,
                            fullName: true,
                        },
                    },
                },
            });

            res.json({
                status: "success",
                data: {
                    ticket,
                },
            });
        } catch (error) {
            next(error);
        }
    },
);

// Add message to ticket
ticketsRouter.post("/:id/messages", async (req, res, next) => {
    try {
        const { content } = createMessageSchema.parse(req.body);

        const ticket = await prisma.ticket.findUnique({
            where: {
                id: req.params.id,
            },
        });

        if (!ticket) {
            throw new AppError(404, "Ticket not found");
        }

        // Check if user has access to the ticket
        if (
            ticket.userId !== req.user!.id && ticket.assigneeId !== req.user!.id
        ) {
            throw new AppError(403, "You do not have access to this ticket");
        }

        const message = await prisma.message.create({
            data: {
                content,
                ticketId: ticket.id,
                userId: req.user!.id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    },
                },
            },
        });

        res.status(201).json({
            status: "success",
            data: {
                message,
            },
        });
    } catch (error) {
        next(error);
    }
});
