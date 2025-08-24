import mongoose, { Document, Schema, Model } from 'mongoose';

// Borrow interface
export interface IBorrow extends Document {
  book: mongoose.Types.ObjectId;
  quantity: number;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Borrow schema
const borrowSchema = new Schema<IBorrow>({
  book: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Book reference is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    validate: {
      validator: Number.isInteger,
      message: 'Quantity must be an integer'
    }
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
    validate: {
      validator(v: Date) {
        return v > new Date();
      },
      message: 'Due date must be in the future'
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
borrowSchema.index({ book: 1 });
borrowSchema.index({ dueDate: 1 });
borrowSchema.index({ createdAt: 1 });

// Pre-save middleware to validate book exists
borrowSchema.pre('save', async function(next) {
  try {
    const Book = mongoose.model('Book');
    const book = await Book.findById(this.book);
    if (!book) {
      throw new Error('Book not found');
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Post-save middleware to log borrow operations
borrowSchema.post('save', function(doc) {
  console.log(`Book borrowed: ${doc.quantity} copies, due: ${doc.dueDate}`);
});

const Borrow: Model<IBorrow> = mongoose.model<IBorrow>('Borrow', borrowSchema);

export default Borrow;
