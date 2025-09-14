import { Types } from "mongoose";

export type TransactionType = "DEPOSIT" | "WITHDRAW" | "TRANSFER";

export interface ITransaction {
    fromWallet?: Types.ObjectId;
    toWallet?: Types.ObjectId;
    amount: number;
    type: TransactionType;
    createdAt?: Date;
    updatedAt?: Date;
}
