import { Types } from "mongoose";

export interface IWallet {
  user: Types.ObjectId;
  balance: number;
  isBlocked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITransaction {
  fromWallet?: Types.ObjectId;
  toWallet?: Types.ObjectId;
  amount: number;
  type: "credit" | "debit" | "transfer";
}
