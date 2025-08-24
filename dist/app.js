"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
// import mongoose from 'mongoose';
const errorHandler_1 = require("./middleware/errorHandler");
const bookRoutes_1 = __importDefault(require("./routes/bookRoutes"));
const borrowRoutes_1 = __importDefault(require("./routes/borrowRoutes"));
// Type assertion to resolve mongoose types issue
// const mongooseAny = mongoose as any;
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://vercel.app', 'https://*.vercel.app']
        : true,
    credentials: true
}));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/books', bookRoutes_1.default);
app.use('/api/borrow', borrowRoutes_1.default);
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
app.use(errorHandler_1.errorHandler);
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        error: `Cannot ${req.method} ${req.originalUrl}`
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map