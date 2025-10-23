import { z } from "zod";

export const TwoFactorValidation = {
  verify2faZodSchema: z.object({
    userId: z.string({ message: "User ID is required" }),
    otp: z.string().length(6, { message: "OTP must be 6 digits" }),
  }),

  toggle2faZodSchema: z.object({
    enable: z.boolean({ required_error: "enable is required", invalid_type_error: "enable must be boolean" }),
  }),
};
