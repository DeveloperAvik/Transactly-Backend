import { IAuthProvider, AccountStatus, DeletionStatus, VerificationStatus, IUser, Role } from "./user.interface";
import { model, Schema, Types } from "mongoose";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    versionKey: false,
    _id: false,
  }
);

const userSchema = new Schema<IUser>(
  {
    // Basic Info
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true }, 
    password: { type: String },
    phoneNumber: { type: String, required: true, unique: true },
    picture: { type: String },
    address: { type: String },

    isDeleted: { type: String, enum: Object.values(DeletionStatus), default: DeletionStatus.UNDELETED },
    isActive: { type: String, enum: Object.values(AccountStatus), default: AccountStatus.ACTIVE },
    isVerified: { type: String, enum: Object.values(VerificationStatus), default: VerificationStatus.UNVERIFIED },

    role: { type: String, enum: Object.values(Role), default: Role.USER },

    auths: [authProviderSchema],

    balance: { type: Number, default: 0 },
    transactionHistory: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
    linkedAccounts: [{ type: String }], 

    createdBy: { type: Types.ObjectId, ref: "User" }, 
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model<IUser>("User", userSchema);
