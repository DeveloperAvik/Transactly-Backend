import { IAuthProvider, IUser, isActive, isDeleted, isVerified, Role } from "./user.interface";
import { model, Schema, Types } from "mongoose";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    _id: false,
    versionKey: false,
  }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    password: { type: String },
    phoneNumber: { type: String, required: true, unique: true },
    picture: { type: String },
    address: { type: String },

    isDeleted: { type: String, enum: Object.values(isDeleted), default: isDeleted.UNDELETED },
    isActive: { type: String, enum: Object.values(isActive), default: isActive.ACTIVE },
    isVerified: { type: String, enum: Object.values(isVerified), default: isVerified.UNVERIFIED },

    role: { type: String, enum: Object.values(Role), default: Role.USER },
    auths: { type: [authProviderSchema], default: [] },

    balance: { type: Number, default: 0 },
    transactionHistory: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
    linkedAccounts: [{ type: String }],

    createdBy: { type: Types.ObjectId, ref: "User" },

    // ✅ NEW FIELDS FOR 2-STEP LOGIN (2FA)
    twoStepEnabled: {
      type: Boolean,
      default: false,
    },
    loginOtp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model<IUser>("User", userSchema);
