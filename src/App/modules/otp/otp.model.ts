import { Schema, model, Document } from "mongoose";
import { IOtp } from "./otp.interface";



const otpSchema = new Schema<IOtp>(
  {
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Otp = model<IOtp>("Otp", otpSchema);
