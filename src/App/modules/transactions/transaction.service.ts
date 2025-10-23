import mongoose from "mongoose";
import { Transaction } from "./transaction.model";
import { Wallet } from "../wallet/wallet.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";

export class TransactionService {
  static async deposit(walletId: string, amount: number) {
    const wallet = await Wallet.findById(walletId);
    if (!wallet) throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");

    wallet.balance += amount;
    await wallet.save();

    return Transaction.create({
      walletId,
      type: "credit",
      amount,
    });
  }

  static async withdraw(walletId: string, amount: number) {
    const wallet = await Wallet.findById(walletId);
    if (!wallet) throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    if (wallet.balance < amount)
      throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");

    wallet.balance -= amount;
    await wallet.save();

    return Transaction.create({
      walletId,
      type: "debit",
      amount,
    });
  }

  static async sendMoney(fromWalletId: string, toWalletId: string, amount: number) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const sender = await Wallet.findById(fromWalletId).session(session);
      const receiver = await Wallet.findById(toWalletId).session(session);

      if (!sender || !receiver)
        throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
      if (sender.balance < amount)
        throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");

      sender.balance -= amount;
      receiver.balance += amount;

      await sender.save({ session });
      await receiver.save({ session });

      const transaction = await Transaction.create(
        [
          {
            walletId: fromWalletId,
            type: "transfer",
            amount,
            fromWalletId,
            toWalletId,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();
      return transaction[0];
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  static async getTransactionsByWalletId(walletId: string) {
    return Transaction.find({ walletId }).sort({ createdAt: -1 });
  }

  static async getAllTransactions() {
    return Transaction.find().sort({ createdAt: -1 });
  }
}
