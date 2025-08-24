"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isConnected = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Type assertion to resolve mongoose types issue
const mongooseAny = mongoose_1.default;
// Cache connection to avoid multiple connections in serverless
let cachedConnection = null;
const connectDB = async () => {
    try {
        // Return cached connection if available
        if (cachedConnection) {
            return;
        }
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            console.log('⚠️  No MongoDB URI provided, skipping database connection');
            return;
        }
        console.log('🔗 MongoDB URI:', mongoURI ? 'Configured' : 'Not configured');
        // Connection options optimized for Vercel serverless
        const options = {
            maxPoolSize: 1, // Reduced for serverless
            serverSelectionTimeoutMS: 5000, // Faster timeout for serverless
            socketTimeoutMS: 30000, // Reduced timeout
            bufferCommands: false,
            // bufferMaxEntries: 0,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        console.log('🔄 Connecting to MongoDB...');
        const connection = await mongooseAny.connect(mongoURI, options);
        // Cache the connection
        cachedConnection = connection;
        console.log('✅ MongoDB connected successfully');
        console.log(`📊 Database: ${mongooseAny.connection.name}`);
        console.log(`🌐 Host: ${mongooseAny.connection.host}`);
        console.log(`🔌 Port: ${mongooseAny.connection.port}`);
    }
    catch (error) {
        console.error('❌ MongoDB connection error:', error);
        cachedConnection = null;
        throw error;
    }
};
exports.connectDB = connectDB;
// Handle connection events
mongooseAny.connection.on('connected', () => {
    console.log('🎉 Mongoose connected to MongoDB');
});
mongooseAny.connection.on('error', (err) => {
    console.error('💥 Mongoose connection error:', err);
    cachedConnection = null;
});
mongooseAny.connection.on('disconnected', () => {
    console.log('🔌 Mongoose disconnected from MongoDB');
    cachedConnection = null;
});
// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        if (mongooseAny.connection.readyState === 1) {
            await mongooseAny.connection.close();
            console.log('🔄 MongoDB connection closed through app termination');
        }
        process.exit(0);
    }
    catch (err) {
        console.error('❌ Error during MongoDB connection closure:', err);
        process.exit(1);
    }
});
// Export connection status check
const isConnected = () => {
    return mongooseAny.connection.readyState === 1;
};
exports.isConnected = isConnected;
//# sourceMappingURL=database.js.map