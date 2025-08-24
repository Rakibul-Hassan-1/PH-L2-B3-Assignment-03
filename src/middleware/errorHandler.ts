import { Request, Response } from 'express';
import mongoose from 'mongoose';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: number;
  keyValue?: any;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response
) => {
  const error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error:', err);

  // MongoDB connection error
  if (err.name === 'MongoNetworkError' || err.message?.includes('ECONNREFUSED')) {
    return res.status(503).json({
      success: false,
      message: 'Database connection failed. Please check your MongoDB connection string.',
      error: {
        name: 'DatabaseConnectionError',
        message: 'Unable to connect to MongoDB. Please ensure MONGODB_URI is set correctly in Vercel environment variables.'
      }
    });
  }

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    const message = 'Validation failed';
    const validationErrors: Record<string, unknown> = {};
    
    Object.keys(err.errors).forEach(key => {
      const errorObj = err.errors[key];
      validationErrors[key] = {
        message: errorObj.message,
        name: errorObj.name,
        properties: (errorObj as any).properties || {},
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
  if (err instanceof mongoose.Error.CastError) {
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

export const createError = (message: string, statusCode: number = 500): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};
