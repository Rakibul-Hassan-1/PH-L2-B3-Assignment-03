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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookGenre = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Book genre enum
var BookGenre;
(function (BookGenre) {
    BookGenre["FICTION"] = "FICTION";
    BookGenre["NON_FICTION"] = "NON_FICTION";
    BookGenre["SCIENCE"] = "SCIENCE";
    BookGenre["HISTORY"] = "HISTORY";
    BookGenre["BIOGRAPHY"] = "BIOGRAPHY";
    BookGenre["FANTASY"] = "FANTASY";
})(BookGenre || (exports.BookGenre = BookGenre = {}));
// Book schema
const bookSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Book title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    author: {
        type: String,
        required: [true, 'Book author is required'],
        trim: true,
        maxlength: [100, 'Author name cannot exceed 100 characters']
    },
    genre: {
        type: String,
        required: [true, 'Book genre is required'],
        enum: {
            values: Object.values(BookGenre),
            message: 'Genre must be one of: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY'
        }
    },
    isbn: {
        type: String,
        required: [true, 'ISBN is required'],
        unique: true,
        trim: true,
        validate: {
            validator(v) {
                // Basic ISBN validation (10 or 13 digits)
                return /^(\d{10}|\d{13})$/.test(v);
            },
            message: 'ISBN must be 10 or 13 digits'
        }
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    copies: {
        type: Number,
        required: [true, 'Number of copies is required'],
        min: [0, 'Copies cannot be negative'],
        validate: {
            validator: Number.isInteger,
            message: 'Copies must be an integer'
        }
    },
    available: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// Index for better query performance
bookSchema.index({ genre: 1, available: 1 });
bookSchema.index({ isbn: 1 });
bookSchema.index({ title: 'text', author: 'text' });
// Static method to update book availability based on copies
bookSchema.statics.updateAvailability = async function (_bookId) {
    const book = await this.findById(_bookId);
    if (book) {
        book.available = book.copies > 0;
        await book.save();
    }
};
// Instance method to check if book can be borrowed
bookSchema.methods.canBeBorrowed = function (_quantity) {
    return this.available && this.copies >= _quantity;
};
// Instance method to borrow copies
bookSchema.methods.borrowCopies = async function (_quantity) {
    if (this.canBeBorrowed(_quantity)) {
        this.copies -= _quantity;
        if (this.copies === 0) {
            this.available = false;
        }
        await this.save();
        return true;
    }
    return false;
};
// Instance method to return copies
bookSchema.methods.returnCopies = async function (_quantity) {
    this.copies += _quantity;
    if (this.copies > 0) {
        this.available = true;
    }
    await this.save();
};
// Pre-save middleware to ensure availability is consistent with copies
bookSchema.pre('save', function (next) {
    if (this.copies === 0) {
        this.available = false;
    }
    else if (this.copies > 0) {
        this.available = true;
    }
    next();
});
// Post-save middleware to log book operations
bookSchema.post('save', function (doc) {
    console.log(`Book "${doc.title}" ${doc.isNew ? 'created' : 'updated'}`);
});
// Virtual for available copies
bookSchema.virtual('availableCopies').get(function () {
    return this.copies;
});
// Ensure virtuals are serialized
bookSchema.set('toJSON', { virtuals: true });
const Book = mongoose_1.default.model('Book', bookSchema);
exports.default = Book;
//# sourceMappingURL=Book.js.map