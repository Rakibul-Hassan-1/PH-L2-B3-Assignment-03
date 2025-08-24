"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Type assertion to resolve mongoose types issue
const mongooseAny = mongoose_1.default;
const connectDB = async () => {
    try {
        // Try environment variable first, then fallback to working MongoDB
        const mongoURI = process.env.MONGODB_URI;
        console.log('🔗 MongoDB URI:', mongoURI);
        // Connection options for better reliability
        const options = {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
            bufferCommands: false,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        console.log('🔄 Connecting to MongoDB...');
        await mongooseAny.connect(mongoURI, options);
        console.log('✅ MongoDB connected successfully');
        console.log(`📊 Database: ${mongooseAny.connection.name}`);
        console.log(`🌐 Host: ${mongooseAny.connection.host}`);
        console.log(`🔌 Port: ${mongooseAny.connection.port}`);
    }
    catch (error) {
        console.error('❌ MongoDB connection error:', error);
        // Try alternative connection if first one fails
    }
};
exports.connectDB = connectDB;
// Handle connection events
mongooseAny.connection.on('connected', () => {
    console.log('🎉 Mongoose connected to MongoDB');
});
mongooseAny.connection.on('error', (err) => {
    console.error('💥 Mongoose connection error:', err);
});
mongooseAny.connection.on('disconnected', () => {
    console.log('🔌 Mongoose disconnected from MongoDB');
});
// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        await mongooseAny.connection.close();
        console.log('🔄 MongoDB connection closed through app termination');
        process.exit(0);
    }
    catch (err) {
        console.error('❌ Error during MongoDB connection closure:', err);
        process.exit(1);
    }
});
//# sourceMappingURL=database.js.map