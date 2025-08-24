import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
// import mongoose from 'mongoose';
import { errorHandler } from './middleware/errorHandler';
import bookRoutes from './routes/bookRoutes';
import borrowRoutes from './routes/borrowRoutes';

// Type assertion to resolve mongoose types issue
// const mongooseAny = mongoose as any;

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://vercel.app', 'https://*.vercel.app'] 
    : true,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Library Management API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// MongoDB connection test endpoint
// app.get('/test-db', async (req, res) => {
//   try {
//     // Use a working MongoDB connection string if environment variable is not set
//     const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://testuser:testpass123@cluster0.mongodb.net/library_management?retryWrites=true&w=majority';
    
//     if (!process.env.MONGODB_URI) {
//       console.log('⚠️  Using fallback MongoDB connection (for testing only)');
//     }
    
//     await mongooseAny.connect(mongoURI);
//     const dbState = mongooseAny.connection.readyState;
//     const dbStates = {
//       0: 'disconnected',
//       1: 'connected',
//       2: 'connecting',
//       3: 'disconnecting'
//     };
    
//     // Get more detailed connection info
//     const connectionInfo = {
//       state: dbStates[dbState as keyof typeof dbStates] || 'unknown',
//       readyState: dbState,
//       connected: dbState === 1,
//       name: mongooseAny.connection.name || 'Not connected',
//       host: mongooseAny.connection.host || 'Not connected',
//       port: mongooseAny.connection.port || 'Not connected'
//     };
    
//     res.json({
//       success: true,
//       message: 'Database connection test',
//       database: connectionInfo,
//       environment: {
//         nodeEnv: process.env.NODE_ENV,
//         hasMongoUri: !!process.env.MONGODB_URI,
//         mongoUriLength: process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0,
//         usingFallback: !process.env.MONGODB_URI
//       },
//       timestamp: new Date().toISOString()
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Database test failed',
//       error: error instanceof Error ? error.message : 'Unknown error',
//       timestamp: new Date().toISOString()
//     });
//   }
// });

// Root endpoint for Vercel
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Library Management API - Welcome!',
    endpoints: {
      health: '/health',
      'test-db': '/test-db',
      books: '/api/books',
      borrow: '/api/borrow'
    },
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    error: `Cannot ${req.method} ${req.originalUrl}`
  });
});

export default app;
