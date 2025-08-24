import mongoose, { Document, Model, Schema } from 'mongoose';

// Book genre enum
export enum BookGenre {
  FICTION = 'FICTION',
  NON_FICTION = 'NON_FICTION',
  SCIENCE = 'SCIENCE',
  HISTORY = 'HISTORY',
  BIOGRAPHY = 'BIOGRAPHY',
  FANTASY = 'FANTASY'
}

// Book interface
export interface IBook extends Document {
  title: string;
  author: string;
  genre: BookGenre;
  isbn: string;
  description?: string;
  copies: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
  canBeBorrowed(quantity: number): boolean;
  borrowCopies(quantity: number): Promise<boolean>;
  returnCopies(quantity: number): Promise<void>;
}

// Book model interface with static methods
export interface IBookModel extends Model<IBook> {
  updateAvailability(bookId: string): Promise<void>;
}

// Book schema
const bookSchema = new Schema<IBook, IBookModel>({
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
      validator(v: string) {
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
bookSchema.statics.updateAvailability = async function(_bookId: string): Promise<void> {
  const book = await this.findById(_bookId);
  if (book) {
    book.available = book.copies > 0;
    await book.save();
  }
};

// Instance method to check if book can be borrowed
bookSchema.methods.canBeBorrowed = function(_quantity: number): boolean {
  return this.available && this.copies >= _quantity;
};

// Instance method to borrow copies
bookSchema.methods.borrowCopies = async function(_quantity: number): Promise<boolean> {
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
bookSchema.methods.returnCopies = async function(_quantity: number): Promise<void> {
  this.copies += _quantity;
  if (this.copies > 0) {
    this.available = true;
  }
  await this.save();
};

// Pre-save middleware to ensure availability is consistent with copies
bookSchema.pre('save', function(next) {
  if (this.copies === 0) {
    this.available = false;
  } else if (this.copies > 0) {
    this.available = true;
  }
  next();
});

// Post-save middleware to log book operations
bookSchema.post('save', function(doc) {
  console.log(`Book "${doc.title}" ${doc.isNew ? 'created' : 'updated'}`);
});

// Virtual for available copies
bookSchema.virtual('availableCopies').get(function() {
  return this.copies;
});

// Ensure virtuals are serialized
bookSchema.set('toJSON', { virtuals: true });

const Book = mongoose.model<IBook, IBookModel>('Book', bookSchema);

export default Book;
