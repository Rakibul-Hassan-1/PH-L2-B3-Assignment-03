import { Document, Model } from 'mongoose';
export declare enum BookGenre {
    FICTION = "FICTION",
    NON_FICTION = "NON_FICTION",
    SCIENCE = "SCIENCE",
    HISTORY = "HISTORY",
    BIOGRAPHY = "BIOGRAPHY",
    FANTASY = "FANTASY"
}
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
export interface IBookModel extends Model<IBook> {
    updateAvailability(bookId: string): Promise<void>;
}
declare const Book: IBookModel;
export default Book;
//# sourceMappingURL=Book.d.ts.map