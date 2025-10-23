import { Otp } from "./otp.model";
import { sendEmail } from "../../utils/emailSender";
import { User } from "../user/user.model";
import { isVerified } from "../user/user.interface";

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const OtpService = {
  async sendOtp(email: string) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt, verified: false },
      { upsert: true, new: true }
    );

    const html = `
      <div style="font-family:sans-serif">
        <h2>🔐 Your OTP Code</h2>
        <p>Hello ${user.name || "User"},</p>
        <p>Your verification code is:</p>
        <h1 style="letter-spacing:4px;">${otp}</h1>
        <p>This code will expire in <b>5 minutes</b>.</p>
      </div>
    `;

    await sendEmail(email, "Verify Your Email - Transactly", html);
    return { message: "OTP sent successfully to your email." };
  },

  async verifyOtp(email: string, otp: string) {
    const otpDoc = await Otp.findOne({ email });
    if (!otpDoc) throw new Error("No OTP found for this email");

    if (otpDoc.verified) return { message: "Email already verified" };
    if (otpDoc.expiresAt < new Date()) throw new Error("OTP expired");
    if (otpDoc.otp !== otp) throw new Error("Invalid OTP");

    otpDoc.verified = true;
    await otpDoc.save();

    await User.findOneAndUpdate({ email }, { isVerified: isVerified.VERIFIED });

    return { message: "Email verified successfully" };
  },
};
