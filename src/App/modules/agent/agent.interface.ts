import { Types } from "mongoose";

export enum AgentStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED",
    SUSPENDED = "SUSPENDED"
}

export enum AgentVerification {
    VERIFIED = "VERIFIED",
    UNVERIFIED = "UNVERIFIED",
}

export enum AgentDeletion {
    DELETED = "DELETED",
    UNDELETED = "UNDELETED",
}

export interface IAgent {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    phoneNumber: string;
    password?: string;
    picture?: string;
    address?: string;
    district?: string;

    commissionRate?: number;

    status?: AgentStatus;
    isVerified?: AgentVerification;
    isDeleted?: AgentDeletion;

    createdBy?: Types.ObjectId;
    transactions?: Types.ObjectId[];
}
