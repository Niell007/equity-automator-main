import { Router } from 'express';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const router = Router();

const ticketSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string(),
  priority: z.string().default('MEDIUM')
});

const messageSchema = z.object({
  content: z.string().min(1)
});

// Get all tickets for the authenticated user
router.get('/tickets', async (req: any, res, next) => {
  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        userId: req.user.id
      },
      include: {
        messages: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.json(tickets);
  } catch (error) {
    next(error);
  }
});

// Get a specific ticket
router.get('/tickets/:id', async (req: any, res, next) => {
  try {
    const ticket = await prisma.ticket.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: {
        messages: true
      }
    });
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    res.json(ticket);
  } catch (error) {
    next(error);
  }
});

// Create a new ticket
router.post('/tickets', async (req: any, res, next) => {
  try {
    const data = ticketSchema.parse(req.body);
    
    const ticket = await prisma.ticket.create({
      data: {
        ...data,
        userId: req.user.id
      },
      include: {
        messages: true
      }
    });
    
    res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
});

// Update a ticket
router.put('/tickets/:id', async (req: any, res, next) => {
  try {
    const data = ticketSchema.partial().parse(req.body);
    
    const ticket = await prisma.ticket.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    const updated = await prisma.ticket.update({
      where: { id: req.params.id },
      data,
      include: {
        messages: true
      }
    });
    
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// Add a message to a ticket
router.post('/tickets/:id/messages', async (req: any, res, next) => {
  try {
    const data = messageSchema.parse(req.body);
    
    const ticket = await prisma.ticket.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    const message = await prisma.message.create({
      data: {
        ...data,
        ticketId: req.params.id,
        isStaff: false
      }
    });
    
    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
});

// Close a ticket
router.post('/tickets/:id/close', async (req: any, res, next) => {
  try {
    const ticket = await prisma.ticket.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    const updated = await prisma.ticket.update({
      where: { id: req.params.id },
      data: {
        status: 'CLOSED',
        closedAt: new Date()
      }
    });
    
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

export const supportRouter = router; 