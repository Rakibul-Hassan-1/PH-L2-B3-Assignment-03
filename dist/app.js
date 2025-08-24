"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const database_1 = require("./config/database");
const errorHandler_1 = require("./middleware/errorHandler");
const bookRoutes_1 = __importDefault(require("./routes/bookRoutes"));
const borrowRoutes_1 = __importDefault(require("./routes/borrowRoutes"));
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://vercel.app', 'https://*.vercel.app', 'https://*.vercel.com']
        : true,
    credentials: true,
}));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Database connection middleware
app.use(async (req, res, next) => {
    try {
        // Only connect if we have a MongoDB URI and not already connected
        if (process.env.MONGODB_URI && !req.app.locals.dbConnected) {
            await (0, database_1.connectDB)();
            req.app.locals.dbConnected = true;
        }
        next();
    }
    catch (error) {
        console.error('Database connection error:', error);
        next();
    }
});
// Routes
app.use('/api/books', bookRoutes_1.default);
app.use('/api/borrow', borrowRoutes_1.default);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Library Management API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: process.env.MONGODB_URI ? 'Configured' : 'Not configured',
    });
});
// Basic health check (no database required)
app.get('/ping', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'pong',
        timestamp: new Date().toISOString(),
    });
});
// Root endpoint for Vercel
app.get('/', (req, res) => {
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
app.use(errorHandler_1.errorHandler);
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        error: `Cannot ${req.method} ${req.originalUrl}`,
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map