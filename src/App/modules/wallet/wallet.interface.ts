import { Types } from "mongoose";

export interface IWallet {
  user: Types.ObjectId;  
  balance: number;
}

export interface ITransaction {
  fromWallet?: Types.ObjectId;
  toWallet?: Types.ObjectId;
  amount: number;
  type: "credit" | "debit" | "transfer";
}
