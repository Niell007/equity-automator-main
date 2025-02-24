import { Router } from 'express';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const router = Router();

const reportSchema = z.object({
  title: z.string().min(1),
  type: z.string(),
  data: z.string(), // JSON data as string
  generatedAt: z.string().datetime().optional()
});

// Get all reports for the authenticated user
router.get('/', async (req: any, res, next) => {
  try {
    const reports = await prisma.report.findMany({
      where: {
        userId: req.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.json(reports);
  } catch (error) {
    next(error);
  }
});

// Get a specific report
router.get('/:id', async (req: any, res, next) => {
  try {
    const report = await prisma.report.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    res.json(report);
  } catch (error) {
    next(error);
  }
});

// Generate a new report
router.post('/', async (req: any, res, next) => {
  try {
    const data = reportSchema.parse(req.body);
    
    const report = await prisma.report.create({
      data: {
        ...data,
        userId: req.user.id,
        generatedAt: new Date()
      }
    });
    
    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
});

// Update a report
router.put('/:id', async (req: any, res, next) => {
  try {
    const data = reportSchema.partial().parse(req.body);
    
    const report = await prisma.report.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    const updated = await prisma.report.update({
      where: { id: req.params.id },
      data
    });
    
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// Delete a report
router.delete('/:id', async (req: any, res, next) => {
  try {
    const report = await prisma.report.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    await prisma.report.delete({
      where: { id: req.params.id }
    });
    
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export const reportsRouter = router; 