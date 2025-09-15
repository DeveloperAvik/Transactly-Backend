import { z } from "zod";

const createWalletZodSchema = z.object({
    user: z.string({ message: "User ID is required" }),
});

export const WalletValidation = {
    createWalletZodSchema,
};
