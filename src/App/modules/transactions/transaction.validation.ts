import { z } from "zod";

// Deposit
const depositTransactionZodSchema = z.object({

    walletId: z.string({ required_error: "Wallet ID is required" }),
    amount: z.number({ required_error: "Amount is required" }).positive(),

});

// Withdraw
const withdrawTransactionZodSchema = z.object({

    walletId: z.string({ required_error: "Wallet ID is required" }),
    amount: z.number({ required_error: "Amount is required" }).positive(),

});

// Transfer
const transferTransactionZodSchema = z.object({

    fromWalletId: z.string({ required_error: "Sender Wallet ID is required" }),
    toWalletId: z.string({ required_error: "Receiver Wallet ID is required" }),
    amount: z.number({ required_error: "Amount is required" }).positive(),

});

export const TransactionValidation = {
    depositTransactionZodSchema,
    withdrawTransactionZodSchema,
    transferTransactionZodSchema,
};
