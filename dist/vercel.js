"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const app_1 = __importDefault(require("./app"));
const database_1 = require("./config/database");
// Vercel serverless function handler
async function handler(req, res) {
    try {
        // Connect to database if not already connected
        if (process.env.MONGODB_URI) {
            await (0, database_1.connectDB)();
        }
        // Handle the request
        return (0, app_1.default)(req, res);
    }
    catch (error) {
        console.error('Vercel handler error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
}
//# sourceMappingURL=vercel.js.map