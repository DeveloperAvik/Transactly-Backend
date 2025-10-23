import { z } from "zod";
import { isActive, isDeleted, isVerified, Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name too short. Minimum 2 characters required." })
    .max(50, { message: "Name too long. Maximum 50 characters allowed." })
    .nonempty({ message: "Name is required." }),

  email: z
    .string()
    .email({ message: "Invalid email format." })
    .min(3, { message: "Email must be at least 3 characters long" })
    .max(100, { message: "Email cannot exceed 100 characters" })
    .nonempty({ message: "Email is required." }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])/, { message: "Password must contain at least 1 uppercase letter." })
    .regex(/^(?=.*[!@#$%^&*])/, { message: "Password must contain at least 1 special character." })
    .regex(/^(?=.*\d)/, { message: "Password must contain at least 1 number." }),

  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number format." })
    .optional(),

  address: z
    .string()
    .max(200, { message: "Address can have a maximum of 200 characters." })
    .optional(),
});

export const updateUserZodSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name too short. Minimum 2 characters required." })
    .max(50, { message: "Name too long. Maximum 50 characters allowed." })
    .optional(),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])/, { message: "Password must contain at least 1 uppercase letter." })
    .regex(/^(?=.*[!@#$%^&*])/, { message: "Password must contain at least 1 special character." })
    .regex(/^(?=.*\d)/, { message: "Password must contain at least 1 number." })
    .optional(),

  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number format." })
    .optional(),

  role: z.enum(Object.values(Role) as [string, ...string[]]).optional(),

  isActive: z.enum(Object.values(isActive) as [string, ...string[]]).optional(),

  isDeleted: z.enum(Object.values(isDeleted) as [string, ...string[]]).optional(),

  isVerified: z.enum(Object.values(isVerified) as [string, ...string[]]).optional(),

  address: z
    .string({ message: "Address must be string" })
    .max(200, { message: "Address cannot exceed 200 characters." })
    .optional(),
});
