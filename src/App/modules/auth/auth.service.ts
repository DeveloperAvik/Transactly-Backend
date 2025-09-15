import { User } from "../user/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { envVars } from "../../config/env";

const getNewAccessToken = async (refreshToken: string) => {
  const decoded = jwt.verify(refreshToken, envVars.jwtRefreshSecret) as { id: string };
  const user = await User.findById(decoded.id);
  if (!user) throw new Error("User not found");

  const accessToken = jwt.sign({ id: user._id }, envVars.jwtAccessSecret, { expiresIn: "15m" });
  return { accessToken };
};

const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: any) => {
  const user = await User.findById(decodedToken.id);
  if (!user || !user.password) throw new Error("Invalid user");

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new Error("Old password does not match");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
};

export const AuthServices = {
  getNewAccessToken,
  resetPassword,
};
