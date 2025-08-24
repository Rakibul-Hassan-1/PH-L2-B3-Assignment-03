import mongoose, { Document, Model } from 'mongoose';
export interface IBorrow extends Document {
    book: mongoose.Types.ObjectId;
    quantity: number;
    dueDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const Borrow: Model<IBorrow>;
export default Borrow;
//# sourceMappingURL=Borrow.d.ts.map