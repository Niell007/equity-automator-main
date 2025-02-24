import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const router = Router();

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  companyName: z.string().optional(),
  is2FAEnabled: z.boolean().optional()
});

const updatePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8)
});

// Get current user profile
router.get('/me', async (req: any, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        companyName: true,
        is2FAEnabled: true,
        createdAt: true,
        lastLoginAt: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/me', async (req: any, res, next) => {
  try {
    const data = updateProfileSchema.parse(req.body);
    
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        companyName: true,
        is2FAEnabled: true,
        createdAt: true,
        lastLoginAt: true
      }
    });
    
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// Update password
router.put('/me/password', async (req: any, res, next) => {
  try {
    const data = updatePasswordSchema.parse(req.body);
    
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const validPassword = await bcrypt.compare(data.currentPassword, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword }
    });
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
});

// Get user activity
router.get('/me/activity', async (req: any, res, next) => {
  try {
    const [documents, reports, tickets] = await Promise.all([
      prisma.document.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      prisma.report.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      prisma.ticket.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { messages: true }
      })
    ]);
    
    res.json({
      recentDocuments: documents,
      recentReports: reports,
      recentTickets: tickets
    });
  } catch (error) {
    next(error);
  }
});

export const usersRouter = router; 