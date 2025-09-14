import { z } from "zod";

// Deposit
const depositTransactionZodSchema = z.object({

    walletId: z.string({ message: "Wallet ID is required" }),
    amount: z.number({ message: "Amount is required" }).positive(),

});

// Withdraw
const withdrawTransactionZodSchema = z.object({

    walletId: z.string({ message: "Wallet ID is required" }),
    amount: z.number({ message: "Amount is required" }).positive(),

});

// Transfer
const transferTransactionZodSchema = z.object({

    fromWalletId: z.string({ message: "Sender Wallet ID is required" }),
    toWalletId: z.string({ message: "Receiver Wallet ID is required" }),
    amount: z.number({ message: "Amount is required" }).positive(),

});

export const TransactionValidation = {
    depositTransactionZodSchema,
    withdrawTransactionZodSchema,
    transferTransactionZodSchema,
};
