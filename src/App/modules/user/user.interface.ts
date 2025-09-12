import { Types } from "mongoose";

export enum Role {
  SUPERADMIN = "superadmin",  // Full system control
  ADMIN = "admin",            // Manages agents, merchants, users
  AGENT = "agent",            // Cash in / cash out service
  MERCHANT = "merchant",      // Businesses receiving payments
  USER = "user"               // Regular wallet users
}

export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

export enum isActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED"
}

export enum isVerified {
  VERIFIED = "VERIFIED",
  UNVERIFIED = "UNVERIFIED"
}

export enum isDeleted {
  DELETED = "DELETED",
  UNDELETED = "UNDELETED"
}

export interface IUser {
  _id?: Types.ObjectId;

  name: string;
  email?: string;
  password?: string;
  phoneNumber: string;
  picture?: string;
  address?: string;

  isDeleted?: isDeleted;
  isActive?: isActive;
  isVerified?: isVerified;

  role: Role;

  auths?: IAuthProvider[];
  balance?: number;                   
  transactionHistory?: Types.ObjectId[]; 
  linkedAccounts?: string[];         
  createdBy?: Types.ObjectId;         
}
