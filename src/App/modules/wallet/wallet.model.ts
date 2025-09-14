import { Schema, model } from "mongoose";
import { IWallet, ITransaction } from "./wallet.interface";

const walletSchema = new Schema<IWallet>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true, // ✅ Ensure only one wallet per user
        },
        balance: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const transactionSchema = new Schema<ITransaction>(
    {
        fromWallet: {
            type: Schema.Types.ObjectId,
            ref: "Wallet",
        },
        toWallet: {
            type: Schema.Types.ObjectId,
            ref: "Wallet",
        },
        amount: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            enum: ["credit", "debit", "transfer"],
            required: true,
        },
    },
    { timestamps: true }
);

export const Wallet = model<IWallet>("Wallet", walletSchema);
export const Transaction = model<ITransaction>("Transaction", transactionSchema);
