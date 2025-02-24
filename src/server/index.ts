import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { authRouter } from './routes/auth';
import { documentsRouter } from './routes/documents';
import { reportsRouter } from './routes/reports';
import { supportRouter } from './routes/support';
import { usersRouter } from './routes/users';
import { errorHandler } from './middleware/errorHandler';
import { authenticate } from './middleware/authenticate';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.VITE_APP_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Equity Automator API',
    version: '1.0.0',
    status: 'running'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/documents', authenticate, documentsRouter);
app.use('/api/reports', authenticate, reportsRouter);
app.use('/api/support', authenticate, supportRouter);
app.use('/api/users', authenticate, usersRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.path
  });
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 