import { z } from "zod";

const createWalletZodSchema = z.object({
    user: z.string({ required_error: "User ID is required" }),
});

export const WalletValidation = {
    createWalletZodSchema,
};
