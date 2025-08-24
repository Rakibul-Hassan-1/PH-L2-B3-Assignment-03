import app from './app';
import { connectDB } from './config/database';

// Vercel serverless function handler
export default async function handler(req: any, res: any) {
  try {
    // Connect to database if not already connected
    if (process.env.MONGODB_URI) {
      await connectDB();
    }
    
    // Handle the request
    return app(req, res);
  } catch (error) {
    console.error('Vercel handler error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
}
