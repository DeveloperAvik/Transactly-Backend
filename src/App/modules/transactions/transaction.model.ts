import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type TransactionType = "credit" | "debit" | "transfer";

export interface ITransaction extends Document {
  walletId: Types.ObjectId;
  type: TransactionType;
  amount: number;
  fromWalletId?: Types.ObjectId;
  toWalletId?: Types.ObjectId;
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    walletId: { type: Schema.Types.ObjectId, ref: "Wallet", required: true },
    type: { type: String, enum: ["credit", "debit", "transfer"], required: true },
    amount: { type: Number, required: true },
    fromWalletId: { type: Schema.Types.ObjectId, ref: "Wallet" },
    toWalletId: { type: Schema.Types.ObjectId, ref: "Wallet" },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export const Transaction: Model<ITransaction> =
  mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);
