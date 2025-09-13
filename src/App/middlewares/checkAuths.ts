import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { verifyToken } from "../utils/jwt";
import AppError from "../errorHelpers/AppError";
import { isActive, isDeleted, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import httpStatus from "http-status-codes";

export const checkAuth =
    (...authRoles: Role[]) =>
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const authHeader = req.headers.authorization;

                if (!authHeader || !authHeader.startsWith("Bearer ")) {
                    throw new AppError(httpStatus.UNAUTHORIZED, "No token provided");
                }

                const accessToken = authHeader.split(" ")[1];
                const verifiedToken = verifyToken(
                    accessToken,
                    envVars.jwtAccessSecret
                ) as JwtPayload;

                const isUserExist = await User.findOne({ email: verifiedToken.email });
                if (!isUserExist) {
                    throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
                }

                if (
                    isUserExist.isActive === isActive.BLOCKED ||
                    isUserExist.isActive === isActive.INACTIVE
                ) {
                    throw new AppError(
                        httpStatus.FORBIDDEN,
                        `User is ${isUserExist.isActive}`
                    );
                }

                if (isUserExist.isDeleted === isDeleted.DELETED) {
                    throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
                }

                const userRole = (verifiedToken.role as Role) || isUserExist.role;

                if (!authRoles.includes(userRole)) {
                    throw new AppError(
                        httpStatus.FORBIDDEN,
                        "You are not permitted to access this route"
                    );
                }

                req.user = verifiedToken;
                next();
            } catch (err) {
                next(err);
            }
        };
