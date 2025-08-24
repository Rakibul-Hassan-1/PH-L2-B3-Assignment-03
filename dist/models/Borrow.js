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
const mongoose_1 = __importStar(require("mongoose"));
// Borrow schema
const borrowSchema = new mongoose_1.Schema({
    book: {
        type: mongoose_1.Schema.Types.ObjectId,
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
            validator(v) {
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
borrowSchema.pre('save', async function (next) {
    try {
        const Book = mongoose_1.default.model('Book');
        const book = await Book.findById(this.book);
        if (!book) {
            throw new Error('Book not found');
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
// Post-save middleware to log borrow operations
borrowSchema.post('save', function (doc) {
    console.log(`Book borrowed: ${doc.quantity} copies, due: ${doc.dueDate}`);
});
const Borrow = mongoose_1.default.model('Borrow', borrowSchema);
exports.default = Borrow;
//# sourceMappingURL=Borrow.js.map