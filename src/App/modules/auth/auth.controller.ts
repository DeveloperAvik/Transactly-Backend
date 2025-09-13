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

export const AuthControllers = {
    // ✅ Login with credentials
    credentialsLogin: async (req: Request, res: Response, next: NextFunction) => {
        try {
            passport.authenticate("local", async (err: any, user: any, info: any) => {
                if (err) return next(new AppError(401, err));
                if (!user) return next(new AppError(401, info.message));

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

    // ✅ Get new access token
    getNewAccessToken: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies.refreshToken;
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

    // ✅ Logout
    logOut: async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.clearCookie("accessToken", { httpOnly: true, secure: false, sameSite: "lax" });
            res.clearCookie("refreshToken", { httpOnly: true, secure: false, sameSite: "lax" });

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

    // ✅ Reset password
    resetPassword: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { oldPassword, newPassword } = req.body;
            const decodedToken = req.user as JwtPayload;

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

    // ✅ Google OAuth callback
    googleCallbackController: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let redirectTo = (req.query.state as string) || "/";
            if (redirectTo.startsWith("/")) redirectTo = redirectTo.slice(1);

            const user = req.user;
            if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

            const tokenInfo = createUserTokens(user);
            setAuthCookie(res, tokenInfo);

            res.redirect(`${envVars.frontendUrl}${redirectTo}`);
        } catch (error) {
            next(error);
        }
    },
};
