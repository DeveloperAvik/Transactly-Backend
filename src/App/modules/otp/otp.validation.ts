import { z } from "zod";

export const OtpValidation = {
  sendOtpZodSchema: z.object({
    email: z.string().email({ message: "Valid email is required" }),
  }),

  verifyOtpZodSchema: z.object({
    email: z.string().email({ message: "Valid email is required" }),
    otp: z.string().length(6, { message: "OTP must be 6 digits" }),
  }),
};
