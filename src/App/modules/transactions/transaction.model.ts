import mongoose, { Schema, Document, Model } from "mongoose";

export type TransactionType = "credit" | "debit" | "transfer";

export interface ITransaction extends Document {
    walletId: string;
    type: TransactionType;
    amount: number;
    fromWalletId?: string;
    toWalletId?: string;
    createdAt: Date;
}

const TransactionSchema: Schema<ITransaction> = new Schema({
    walletId: { type: String, required: true },
    type: { type: String, enum: ["credit", "debit", "transfer"], required: true },
    amount: { type: Number, required: true },
    fromWalletId: { type: String },
    toWalletId: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export const Transaction: Model<ITransaction> =
    mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);
