import express from 'express';
import { createError } from '../middleware/errorHandler';
import Book from '../models/Book';
import Borrow from '../models/Borrow';

const router = express.Router();

// 6. Borrow a Book - POST /api/borrow
router.post('/', async (req, res, next) => {
  try {
    const { book: bookId, quantity, dueDate } = req.body;

    // Validate required fields
    if (!bookId || !quantity || !dueDate) {
      throw createError('Missing required fields: book, quantity, dueDate', 400);
    }

    // Validate ObjectId format
    if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
      throw createError('Invalid book ID format', 400);
    }

    // Validate quantity
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw createError('Quantity must be a positive integer', 400);
    }

    // Validate due date
    const dueDateObj = new Date(dueDate);
    if (isNaN(dueDateObj.getTime()) || dueDateObj <= new Date()) {
      throw createError('Due date must be a valid future date', 400);
    }

    // Find the book
    const book = await Book.findById(bookId);
    if (!book) {
      throw createError('Book not found', 404);
    }

    // Check if book can be borrowed
    if (!book.canBeBorrowed(quantity)) {
      throw createError(
        `Cannot borrow ${quantity} copies. Available: ${book.copies}, Available for borrowing: ${book.available}`,
        400
      );
    }

    // Create borrow record
    const borrow = new Borrow({
      book: bookId,
      quantity,
      dueDate: dueDateObj
    });

    const savedBorrow = await borrow.save();

    // Update book copies and availability
    await book.borrowCopies(quantity);

    res.status(201).json({
      success: true,
      message: 'Book borrowed successfully',
      data: savedBorrow
    });
  } catch (error) {
    next(error);
  }
});

// 7. Borrowed Books Summary - GET /api/borrow (Using Aggregation Pipeline)
router.get('/', async (req, res, next) => {
  try {
    // Use MongoDB aggregation pipeline to get borrowed books summary
    const borrowedSummary = await Borrow.aggregate([
      // Group by book and sum quantities
      {
        $group: {
          _id: '$book',
          totalQuantity: { $sum: '$quantity' }
        }
      },
      // Lookup book details
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'bookDetails'
        }
      },
      // Unwind book details array
      {
        $unwind: '$bookDetails'
      },
      // Project the required fields
      {
        $project: {
          _id: 0,
          book: {
            title: '$bookDetails.title',
            isbn: '$bookDetails.isbn'
          },
          totalQuantity: 1
        }
      },
      // Sort by total quantity (descending)
      {
        $sort: { totalQuantity: -1 }
      }
    ]);

    res.json({
      success: true,
      message: 'Borrowed books summary retrieved successfully',
      data: borrowedSummary
    });
  } catch (error) {
    next(error);
  }
});

export default router;
