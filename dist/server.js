"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const database_1 = require("./config/database");
// Load environment variables
dotenv_1.default.config();
const PORT = process.env.PORT || 5001;
// Start server
const startServer = async () => {
    try {
        // Connect to MongoDB
        await (0, database_1.connectDB)();
        console.log('✅ Connected to MongoDB');
        // Start Express server
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📚 Library Management API ready at http://localhost:${PORT}`);
            console.log(`🏥 Health check: http://localhost:${PORT}/health`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    process.exit(0);
});
// Start the server
startServer();
//# sourceMappingURL=server.js.map