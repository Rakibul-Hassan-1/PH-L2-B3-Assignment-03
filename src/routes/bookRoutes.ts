import express from 'express';
import { createError } from '../middleware/errorHandler';
import Book, { BookGenre } from '../models/Book';

const router = express.Router();

// 1. Create Book - POST /api/books
router.post(
  '/',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { title, author, genre, isbn, description, copies, available } =
        req.body;

      // Validate required fields
      if (!title || !author || !genre || !isbn || copies === undefined) {
        throw createError('Missing required fields', 400);
      }

      // Validate genre
      if (!Object.values(BookGenre).includes(genre)) {
        throw createError('Invalid genre', 400);
      }

      // Create new book
      const book = new Book({
        title,
        author,
        genre,
        isbn,
        description,
        copies,
        available: available !== undefined ? available : true,
      });

      const savedBook = await book.save();

      res.status(201).json({
        success: true,
        message: 'Book created successfully',
        data: savedBook,
      });
    } catch (error) {
      next(error);
    }
  }
);

// 2. Get All Books - GET /api/books
router.get(
  '/',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const {
        filter,
        sortBy = 'createdAt',
        sort = 'desc',
        limit = 10,
      } = req.query;

      // Build query
      const query: Record<string, unknown> = {};

      // Apply genre filter
      if (filter && Object.values(BookGenre).includes(filter as BookGenre)) {
        query.genre = filter;
      }

      // Build sort object
      const sortObj: Record<string, 1 | -1> = {};
      sortObj[sortBy as string] = sort === 'asc' ? 1 : -1;

      // Execute query with pagination
      const books = await Book.find(query)
        .sort(sortObj)
        .limit(Number(limit))
        .select('-__v');

      res.json({
        success: true,
        message: 'Books retrieved successfully',
        data: books,
      });
    } catch (error) {
      next(error);
    }
  }
);

// 3. Get Book by ID - GET /api/books/:bookId
router.get(
  '/:bookId',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { bookId } = req.params;

      // Validate ObjectId format
      if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
        throw createError('Invalid book ID format', 400);
      }

      const book = await Book.findById(bookId).select('-__v');

      if (!book) {
        throw createError('Book not found', 404);
      }

      res.json({
        success: true,
        message: 'Book retrieved successfully',
        data: book,
      });
    } catch (error) {
      next(error);
    }
  }
);

// 4. Update Book - PUT /api/books/:bookId
router.put(
  '/:bookId',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { bookId } = req.params;
      const updateData = req.body;

      // Validate ObjectId format
      if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
        throw createError('Invalid book ID format', 400);
      }

      // Remove immutable fields
      delete updateData._id;
      delete updateData.createdAt;
      delete updateData.updatedAt;

      // Find and update book
      const book = await Book.findByIdAndUpdate(bookId, updateData, {
        new: true,
        runValidators: true,
      }).select('-__v');

      if (!book) {
        throw createError('Book not found', 404);
      }

      // Update availability if copies changed
      if (updateData.copies !== undefined) {
        await Book.updateAvailability(bookId);
        // Fetch updated book
        const updatedBook = await Book.findById(bookId).select('-__v');
        if (updatedBook) {
          return res.json({
            success: true,
            message: 'Book updated successfully',
            data: updatedBook,
          });
        }
      }

      res.json({
        success: true,
        message: 'Book updated successfully',
        data: book,
      });
    } catch (error) {
      next(error);
    }
  }
);

// 5. Delete Book - DELETE /api/books/:bookId
router.delete(
  '/:bookId',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { bookId } = req.params;

      // Validate ObjectId format
      if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
        throw createError('Invalid book ID format', 400);
      }

      const book = await Book.findByIdAndDelete(bookId);

      if (!book) {
        throw createError('Book not found', 404);
      }

      res.json({
        success: true,
        message: 'Book deleted successfully',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
