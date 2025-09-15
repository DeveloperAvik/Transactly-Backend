import { z } from "zod";

const createAgentZodSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Name is required"),
        email: z.string().email("Invalid email"),
        phoneNumber: z.string().min(10, "Phone number is required"),
        address: z.string().optional(),
        commissionRate: z.number().min(0).max(100).optional(), 
        isActive: z.enum(["ACTIVE", "INACTIVE"]).optional(),
    }),
});


const updateAgentZodSchema = z.object({
    body: z.object({
        name: z.string().min(2).optional(),
        email: z.string().email().optional(),
        phoneNumber: z.string().min(10).optional(),
        address: z.string().optional(),
        commissionRate: z.number().min(0).max(100).optional(),
        isActive: z.enum(["ACTIVE", "INACTIVE"]).optional(),
    }),
});

export const AgentValidation = {
    createAgentZodSchema,
    updateAgentZodSchema,
};
