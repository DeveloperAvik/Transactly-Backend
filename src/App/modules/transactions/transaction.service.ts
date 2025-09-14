import { Transaction, ITransaction } from "./transaction.model";
import { Wallet } from "../wallet/wallet.model";

export class TransactionService {
    static async deposit(walletId: string, amount: number) {
        const wallet = await Wallet.findById(walletId);
        if (!wallet) throw new Error("Wallet not found");

        wallet.balance += amount;
        await wallet.save();

        const transaction = await Transaction.create({
            walletId,
            type: "credit",
            amount,
        });

        return transaction;
    }

    static async withdraw(walletId: string, amount: number) {
        const wallet = await Wallet.findById(walletId);
        if (!wallet) throw new Error("Wallet not found");

        if (wallet.balance < amount) throw new Error("Insufficient balance");

        wallet.balance -= amount;
        await wallet.save();

        const transaction = await Transaction.create({
            walletId,
            type: "debit",
            amount,
        });

        return transaction;
    }

    static async sendMoney(fromWalletId: string, toWalletId: string, amount: number) {
        const sender = await Wallet.findById(fromWalletId);
        const receiver = await Wallet.findById(toWalletId);

        if (!sender || !receiver) throw new Error("Wallet not found");
        if (sender.balance < amount) throw new Error("Insufficient balance");

        sender.balance -= amount;
        receiver.balance += amount;

        await sender.save();
        await receiver.save();

        const transaction = await Transaction.create({
            walletId: fromWalletId,
            type: "transfer",
            amount,
            fromWalletId,
            toWalletId,
        });

        return transaction;
    }

    static async getTransactionsByWalletId(walletId: string) {
        return Transaction.find({ walletId }).sort({ createdAt: -1 });
    }

    static async getAllTransactions() {
        return Transaction.find().sort({ createdAt: -1 });
    }
}
