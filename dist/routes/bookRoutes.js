"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorHandler_1 = require("../middleware/errorHandler");
const Book_1 = __importStar(require("../models/Book"));
const router = express_1.default.Router();
// 1. Create Book - POST /api/books
router.post('/', async (req, res, next) => {
    try {
        const { title, author, genre, isbn, description, copies, available } = req.body;
        // Validate required fields
        if (!title || !author || !genre || !isbn || copies === undefined) {
            throw (0, errorHandler_1.createError)('Missing required fields', 400);
        }
        // Validate genre
        if (!Object.values(Book_1.BookGenre).includes(genre)) {
            throw (0, errorHandler_1.createError)('Invalid genre', 400);
        }
        // Create new book
        const book = new Book_1.default({
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
    }
    catch (error) {
        next(error);
    }
});
// 2. Get All Books - GET /api/books
router.get('/', async (req, res, next) => {
    try {
        const { filter, sortBy = 'createdAt', sort = 'desc', limit = 10, } = req.query;
        // Build query
        const query = {};
        // Apply genre filter
        if (filter && Object.values(Book_1.BookGenre).includes(filter)) {
            query.genre = filter;
        }
        // Build sort object
        const sortObj = {};
        sortObj[sortBy] = sort === 'asc' ? 1 : -1;
        // Execute query with pagination
        const books = await Book_1.default.find(query)
            .sort(sortObj)
            .limit(Number(limit))
            .select('-__v');
        res.json({
            success: true,
            message: 'Books retrieved successfully',
            data: books,
        });
    }
    catch (error) {
        next(error);
    }
});
// 3. Get Book by ID - GET /api/books/:bookId
router.get('/:bookId', async (req, res, next) => {
    try {
        const { bookId } = req.params;
        // Validate ObjectId format
        if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
            throw (0, errorHandler_1.createError)('Invalid book ID format', 400);
        }
        const book = await Book_1.default.findById(bookId).select('-__v');
        if (!book) {
            throw (0, errorHandler_1.createError)('Book not found', 404);
        }
        res.json({
            success: true,
            message: 'Book retrieved successfully',
            data: book,
        });
    }
    catch (error) {
        next(error);
    }
});
// 4. Update Book - PUT /api/books/:bookId
router.put('/:bookId', async (req, res, next) => {
    try {
        const { bookId } = req.params;
        const updateData = req.body;
        // Validate ObjectId format
        if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
            throw (0, errorHandler_1.createError)('Invalid book ID format', 400);
        }
        // Remove immutable fields
        delete updateData._id;
        delete updateData.createdAt;
        delete updateData.updatedAt;
        // Find and update book
        const book = await Book_1.default.findByIdAndUpdate(bookId, updateData, {
            new: true,
            runValidators: true,
        }).select('-__v');
        if (!book) {
            throw (0, errorHandler_1.createError)('Book not found', 404);
        }
        // Update availability if copies changed
        if (updateData.copies !== undefined) {
            await Book_1.default.updateAvailability(bookId);
            // Fetch updated book
            const updatedBook = await Book_1.default.findById(bookId).select('-__v');
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
    }
    catch (error) {
        next(error);
    }
});
// 5. Delete Book - DELETE /api/books/:bookId
router.delete('/:bookId', async (req, res, next) => {
    try {
        const { bookId } = req.params;
        // Validate ObjectId format
        if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
            throw (0, errorHandler_1.createError)('Invalid book ID format', 400);
        }
        const book = await Book_1.default.findByIdAndDelete(bookId);
        if (!book) {
            throw (0, errorHandler_1.createError)('Book not found', 404);
        }
        res.json({
            success: true,
            message: 'Book deleted successfully',
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=bookRoutes.js.map