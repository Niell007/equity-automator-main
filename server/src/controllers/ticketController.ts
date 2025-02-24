import { Request, Response } from 'express';
import prisma from '../config/database';
import { z } from 'zod';

const ticketSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
});

const messageSchema = z.object({
  content: z.string().min(1),
});

export const createTicket = async (req: Request, res: Response) => {
  try {
    const validation = ticketSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error });
    }

    const { title, description, priority } = validation.data;

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority,
        status: 'OPEN',
        userId: req.user?.id || '',
      },
      include: {
        messages: true,
      },
    });

    res.status(201).json({ ticket });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        userId: req.user?.id,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({ tickets });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTicket = async (req: Request, res: Response) => {
  try {
    const ticket = await prisma.ticket.findFirst({
      where: {
        id: req.params.id,
        userId: req.user?.id,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json({ ticket });
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTicket = async (req: Request, res: Response) => {
  try {
    const updateSchema = z.object({
      title: z.string().min(1).optional(),
      description: z.string().min(1).optional(),
      status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
      priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    });

    const validation = updateSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error });
    }

    const ticket = await prisma.ticket.findFirst({
      where: {
        id: req.params.id,
        userId: req.user?.id,
      },
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id: req.params.id },
      data: {
        ...validation.data,
        closedAt: validation.data.status === 'CLOSED' ? new Date() : undefined,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    res.json({ ticket: updatedTicket });
  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTicket = async (req: Request, res: Response) => {
  try {
    const ticket = await prisma.ticket.findFirst({
      where: {
        id: req.params.id,
        userId: req.user?.id,
      },
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Delete all messages associated with the ticket
    await prisma.message.deleteMany({
      where: {
        ticketId: req.params.id,
      },
    });

    // Delete the ticket
    await prisma.ticket.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Delete ticket error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addMessage = async (req: Request, res: Response) => {
  try {
    const validation = messageSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error });
    }

    const ticket = await prisma.ticket.findFirst({
      where: {
        id: req.params.id,
        userId: req.user?.id,
      },
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const message = await prisma.message.create({
      data: {
        content: validation.data.content,
        ticketId: req.params.id,
        isStaff: false,
      },
    });

    // Update ticket status if it was closed
    if (ticket.status === 'CLOSED') {
      await prisma.ticket.update({
        where: { id: req.params.id },
        data: {
          status: 'OPEN',
          closedAt: null,
        },
      });
    }

    res.status(201).json({ message });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const ticket = await prisma.ticket.findFirst({
      where: {
        id: req.params.id,
        userId: req.user?.id,
      },
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const messages = await prisma.message.findMany({
      where: {
        ticketId: req.params.id,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    res.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 