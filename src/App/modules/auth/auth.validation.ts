import { z } from "zod";

export const TwoFactorValidation = {
  verify2faZodSchema: z.object({
    body: z.object({
      userId: z.string({ message: "userId is required" }),
      otp: z.string().length(6, { message: "OTP must be exactly 6 digits" }),
    }),
  }),

  toggle2faZodSchema: z.object({
    body: z.object({
      enable: z.boolean({ message: "enable must be boolean" }),
    }),
  }),
};
