"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/library_management';
        await mongoose_1.default.connect(mongoURI);
        console.log('MongoDB connected successfully');
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
// Handle connection events
mongoose_1.default.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});
mongoose_1.default.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});
mongoose_1.default.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
});
// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        await mongoose_1.default.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
    }
    catch (err) {
        console.error('Error during MongoDB connection closure:', err);
        process.exit(1);
    }
});
//# sourceMappingURL=database.js.map