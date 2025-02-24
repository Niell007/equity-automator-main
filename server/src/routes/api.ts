import express from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import * as userController from '../controllers/userController';
import * as documentController from '../controllers/documentController';
import * as reportController from '../controllers/reportController';
import * as ticketController from '../controllers/ticketController';

const router = express.Router();

// Auth routes
router.post('/auth/register', userController.register);
router.post('/auth/login', userController.login);

// User routes
router.get('/user/profile', authenticate, userController.getProfile);
router.put('/user/profile', authenticate, userController.updateProfile);

// Document routes
router.post('/documents', authenticate, documentController.upload.single('file'), documentController.uploadDocument);
router.get('/documents', authenticate, documentController.getDocuments);
router.get('/documents/:id', authenticate, documentController.getDocument);
router.put('/documents/:id', authenticate, documentController.updateDocument);
router.delete('/documents/:id', authenticate, documentController.deleteDocument);

// Report routes
router.post('/reports', authenticate, reportController.generateReport);
router.get('/reports', authenticate, reportController.getReports);
router.get('/reports/:id', authenticate, reportController.getReport);
router.put('/reports/:id', authenticate, reportController.updateReport);
router.delete('/reports/:id', authenticate, reportController.deleteReport);

// B-BBEE Scorecard routes
router.post('/reports/bbbee-scorecard', authenticate, reportController.generateBBBEEScorecard);

// Ticket routes
router.post('/tickets', authenticate, ticketController.createTicket);
router.get('/tickets', authenticate, ticketController.getTickets);
router.get('/tickets/:id', authenticate, ticketController.getTicket);
router.put('/tickets/:id', authenticate, ticketController.updateTicket);
router.delete('/tickets/:id', authenticate, ticketController.deleteTicket);

// Ticket message routes
router.post('/tickets/:id/messages', authenticate, ticketController.addMessage);
router.get('/tickets/:id/messages', authenticate, ticketController.getMessages);

// Admin routes
router.get('/admin/users', authenticate, requireRole(['ADMIN']), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });
    res.json({ users });
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 