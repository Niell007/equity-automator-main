import { Router } from 'express';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const router = Router();

const documentSchema = z.object({
  title: z.string().min(1),
  type: z.string(),
  fileUrl: z.string().url(),
  expiresAt: z.string().datetime().optional()
});

// Get all documents for the authenticated user
router.get('/', async (req: any, res, next) => {
  try {
    const documents = await prisma.document.findMany({
      where: {
        userId: req.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.json(documents);
  } catch (error) {
    next(error);
  }
});

// Get a specific document
router.get('/:id', async (req: any, res, next) => {
  try {
    const document = await prisma.document.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    res.json(document);
  } catch (error) {
    next(error);
  }
});

// Create a new document
router.post('/', async (req: any, res, next) => {
  try {
    const data = documentSchema.parse(req.body);
    
    const document = await prisma.document.create({
      data: {
        ...data,
        userId: req.user.id
      }
    });
    
    res.status(201).json(document);
  } catch (error) {
    next(error);
  }
});

// Update a document
router.put('/:id', async (req: any, res, next) => {
  try {
    const data = documentSchema.partial().parse(req.body);
    
    const document = await prisma.document.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    const updated = await prisma.document.update({
      where: { id: req.params.id },
      data
    });
    
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// Delete a document
router.delete('/:id', async (req: any, res, next) => {
  try {
    const document = await prisma.document.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    await prisma.document.delete({
      where: { id: req.params.id }
    });
    
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export const documentsRouter = router; 