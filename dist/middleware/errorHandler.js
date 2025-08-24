"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createError = exports.errorHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const errorHandler = (err, req, res) => {
    const error = { ...err };
    error.message = err.message;
    // Log error for debugging
    console.error('Error:', err);
    // Mongoose validation error
    if (err instanceof mongoose_1.default.Error.ValidationError) {
        const message = 'Validation failed';
        const validationErrors = {};
        Object.keys(err.errors).forEach(key => {
            const errorObj = err.errors[key];
            validationErrors[key] = {
                message: errorObj.message,
                name: errorObj.name,
                properties: errorObj.properties || {},
                kind: errorObj.kind,
                path: errorObj.path,
                value: errorObj.value
            };
        });
        return res.status(400).json({
            success: false,
            message,
            error: {
                name: 'ValidationError',
                errors: validationErrors
            }
        });
    }
    // Mongoose cast error (invalid ObjectId)
    if (err instanceof mongoose_1.default.Error.CastError) {
        const message = 'Invalid ID format';
        return res.status(400).json({
            success: false,
            message,
            error: {
                name: 'CastError',
                message: 'Invalid ID format',
                path: err.path,
                value: err.value
            }
        });
    }
    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0];
        const message = `${field} already exists`;
        return res.status(400).json({
            success: false,
            message,
            error: {
                name: 'DuplicateKeyError',
                message,
                field,
                value: err.keyValue?.[field]
            }
        });
    }
    // Default error
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        message,
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
};
exports.errorHandler = errorHandler;
const createError = (message, statusCode = 500) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.isOperational = true;
    return error;
};
exports.createError = createError;
//# sourceMappingURL=errorHandler.js.map