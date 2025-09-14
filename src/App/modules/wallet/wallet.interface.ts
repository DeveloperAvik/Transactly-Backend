import { Types } from "mongoose";

export interface IWallet {
  user: Types.ObjectId;   // Reference to User
  balance: number;
}

export interface ITransaction {
  fromWallet?: Types.ObjectId;
  toWallet?: Types.ObjectId;
  amount: number;
  type: "credit" | "debit" | "transfer";
}
