import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import bookRoutes from './routes/bookRoutes';
import borrowRoutes from './routes/borrowRoutes';

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://vercel.app', 'https://*.vercel.app', 'https://*.vercel.com']
        : true,
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection middleware
app.use(async (req, res, next) => {
  try {
    // Only connect if we have a MongoDB URI and not already connected
    if (process.env.MONGODB_URI && !req.app.locals.dbConnected) {
      await connectDB();
      req.app.locals.dbConnected = true;
    }
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    next();
  }
});

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);

// Health check endpoint
app.get('/health', (req: express.Request, res: express.Response) => {
  res.status(200).json({
    success: true,
    message: 'Library Management API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: process.env.MONGODB_URI ? 'Configured' : 'Not configured',
  });
});

// Basic health check (no database required)
app.get('/ping', (req: express.Request, res: express.Response) => {
  res.status(200).json({
    success: true,
    message: 'pong',
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint for Vercel
app.get('/', (req: express.Request, res: express.Response) => {
  res.status(200).json({
    success: true,
    message: 'Library Management API - Welcome!',
    endpoints: {
      health: '/health',
      books: '/api/books',
      borrow: '/api/borrow',
    },
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req: express.Request, res: express.Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    error: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

export default app;
