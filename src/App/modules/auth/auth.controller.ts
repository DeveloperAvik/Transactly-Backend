import { Request, Response, NextFunction } from "express";
import passport from "passport";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";

import AppError from "../../errorHelpers/AppError";
import { AuthServices } from "./auth.service";
import { setAuthCookie } from "../../utils/setCookie";
import { createUserTokens } from "../../utils/userTokens";
import { envVars } from "../../config/env";
import { sendResponse } from "../../utils/sendRespose";
import { User } from "../user/user.model";
import { sendEmail } from "../../utils/emailSender";
import { UserServices } from "../user/user.service"; // ✅ Added import

/**
 * Auth controller — handles register + login + 2FA + refresh/logout/reset
 */
export const AuthControllers = {
  /**
   * ✅ POST /auth/register
   * Handles user registration
   */
  registerUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = req.body;
      const newUser = await UserServices.createUser(userData);

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User registered successfully",
        data: newUser,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * ✅ POST /auth/login
   * Uses passport local to validate credentials.
   * If user.twoStepEnabled => generate OTP, email it, and respond with { twoStep: true, userId }
   * Otherwise => issue tokens immediately.
   */
  credentialsLogin: async (req: Request, res: Response, next: NextFunction) => {
    try {
      passport.authenticate("local", async (err: any, user: any, info: any) => {
        if (err) return next(new AppError(httpStatus.UNAUTHORIZED, String(err)));
        if (!user) return next(new AppError(httpStatus.UNAUTHORIZED, info?.message || "Authentication failed"));

        // If 2-step verification is enabled, generate OTP and send it — do NOT issue tokens yet
        if (user.twoStepEnabled) {
          const otp = Math.floor(100000 + Math.random() * 900000).toString();
          user.loginOtp = otp;
          user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
          await user.save();

          // send OTP (email)
          if (user.email) {
            await sendEmail(
              user.email,
              "Your 2FA Login Code",
              `<div style="font-family:sans-serif">
                <h2>2-Step Verification</h2>
                <p>Your login OTP is:</p>
                <h1 style="letter-spacing:6px;">${otp}</h1>
                <p>This code expires in 5 minutes.</p>
              </div>`
            );
          }

          return sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "2FA required. OTP sent to your email (if available).",
            data: { twoStep: true, userId: user._id },
          });
        }

        // Normal login flow (no 2FA)
        const userTokens = await createUserTokens(user);
        const { password: _pass, ...rest } = user.toObject();

        setAuthCookie(res, userTokens);

        sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "User logged in successfully",
          data: {
            accessToken: userTokens.accessToken,
            refreshToken: userTokens.refreshToken,
            user: rest,
          },
        });
      })(req, res, next);
    } catch (error) {
      next(error);
    }
  },

  /**
   * ✅ POST /auth/verify-2fa
   * Body: { userId, otp }
   */
  verifyTwoStepOtp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, otp } = req.body;

      if (!userId || !otp) {
        throw new AppError(httpStatus.BAD_REQUEST, "userId and otp are required");
      }

      const user = await User.findById(userId);
      if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

      if (!user.loginOtp || !user.otpExpires) {
        throw new AppError(httpStatus.BAD_REQUEST, "No OTP pending for this user");
      }

      if (user.otpExpires < new Date()) {
        user.loginOtp = null;
        user.otpExpires = null;
        await user.save();
        throw new AppError(httpStatus.BAD_REQUEST, "OTP expired");
      }

      if (user.loginOtp !== otp) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP");
      }

      user.loginOtp = null;
      user.otpExpires = null;
      await user.save();

      const userTokens = createUserTokens(user);
      setAuthCookie(res, userTokens);

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "2FA verification successful",
        data: {
          accessToken: userTokens.accessToken,
          refreshToken: userTokens.refreshToken,
          user: {
            _id: user._id,
            email: user.email,
            role: user.role,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * ✅ POST /auth/2fa-toggle
   * Body: { enable: boolean }
   */
  toggleTwoStep: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const decoded = req.user as JwtPayload | undefined;
      if (!decoded || !decoded.userId) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");
      }

      const { enable } = req.body;
      if (typeof enable !== "boolean") {
        throw new AppError(httpStatus.BAD_REQUEST, "enable must be boolean");
      }

      const user = await User.findById(decoded.userId);
      if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

      user.twoStepEnabled = Boolean(enable);

      if (!user.twoStepEnabled) {
        user.loginOtp = null;
        user.otpExpires = null;
      }

      await user.save();

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: `2-Step Verification ${user.twoStepEnabled ? "enabled" : "disabled"} successfully`,
        data: { twoStepEnabled: user.twoStepEnabled },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * ✅ POST /auth/refresh-token
   */
  getNewAccessToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No refresh token found in cookies");
      }

      const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);
      setAuthCookie(res, tokenInfo);

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "New access token retrieved successfully",
        data: tokenInfo,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * ✅ POST /auth/logout
   */
  logOut: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("accessToken", { httpOnly: true, secure: envVars.nodeEnv === "production", sameSite: "lax" });
      res.clearCookie("refreshToken", { httpOnly: true, secure: envVars.nodeEnv === "production", sameSite: "lax" });

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged out successfully",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * ✅ POST /auth/reset-password
   */
  resetPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const decodedToken = req.user as JwtPayload | undefined;

      if (!decodedToken || !decodedToken.userId) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");
      }

      await AuthServices.resetPassword(oldPassword, newPassword, decodedToken);

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password changed successfully",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * ✅ GET /auth/google/callback
   */
  googleCallbackController: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let redirectTo = (req.query.state as string) || "/";
      if (redirectTo.startsWith("/")) redirectTo = redirectTo.slice(1);

      const user = req.user;
      if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

      const tokenInfo = createUserTokens(user as any);
      setAuthCookie(res, tokenInfo);

      res.redirect(`${envVars.frontendUrl}${redirectTo}`);
    } catch (error) {
      next(error);
    }
  },
};
