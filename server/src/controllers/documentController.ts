import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import prisma from '../config/database';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Configure multer for file uploads
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

const documentSchema = z.object({
  title: z.string().min(1),
  type: z.string().min(1),
  expiresAt: z.string().datetime().optional(),
});

export const uploadDocument = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const validation = documentSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error });
    }

    const { title, type, expiresAt } = validation.data;
    const file = req.file;

    // Upload file to Supabase Storage
    const fileName = `${Date.now()}-${file.originalname}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) {
      return res.status(400).json({ error: uploadError.message });
    }

    // Get public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);

    // Create document record in database
    const document = await prisma.document.create({
      data: {
        title,
        type,
        status: 'PENDING',
        userId: req.user?.id || '',
        fileUrl: publicUrl,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    res.status(201).json({ document });
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getDocuments = async (req: Request, res: Response) => {
  try {
    const documents = await prisma.document.findMany({
      where: {
        userId: req.user?.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({ documents });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getDocument = async (req: Request, res: Response) => {
  try {
    const document = await prisma.document.findFirst({
      where: {
        id: req.params.id,
        userId: req.user?.id,
      },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({ document });
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateDocument = async (req: Request, res: Response) => {
  try {
    const updateSchema = z.object({
      title: z.string().min(1).optional(),
      status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
      expiresAt: z.string().datetime().optional(),
    });

    const validation = updateSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error });
    }

    const document = await prisma.document.findFirst({
      where: {
        id: req.params.id,
        userId: req.user?.id,
      },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const updatedDocument = await prisma.document.update({
      where: { id: req.params.id },
      data: {
        ...validation.data,
        expiresAt: validation.data.expiresAt ? new Date(validation.data.expiresAt) : undefined,
      },
    });

    res.json({ document: updatedDocument });
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const document = await prisma.document.findFirst({
      where: {
        id: req.params.id,
        userId: req.user?.id,
      },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Delete file from Supabase Storage
    const fileName = document.fileUrl.split('/').pop();
    if (fileName) {
      const { error: deleteError } = await supabase.storage
        .from('documents')
        .remove([fileName]);

      if (deleteError) {
        console.error('Error deleting file from storage:', deleteError);
      }
    }

    // Delete document record from database
    await prisma.document.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 