import { Schema, model } from "mongoose";
import { IAgent, AgentStatus, AgentVerification, AgentDeletion } from "./agent.interface";

// Define schema
const agentSchema = new Schema<IAgent>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        phoneNumber: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        picture: { type: String },
        address: { type: String, maxlength: 200 },

        commissionRate: { type: Number, default: 1 }, // Default 1% commission

        status: {
            type: String,
            enum: Object.values(AgentStatus),
            default: AgentStatus.ACTIVE,
        },
        isVerified: {
            type: String,
            enum: Object.values(AgentVerification),
            default: AgentVerification.UNVERIFIED,
        },
        isDeleted: {
            type: String,
            enum: Object.values(AgentDeletion),
            default: AgentDeletion.UNDELETED,
        },

        createdBy: { type: Schema.Types.ObjectId, ref: "User" }, // Admin/SuperAdmin
        transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const Agent = model<IAgent>("Agent", agentSchema);
