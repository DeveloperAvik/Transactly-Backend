import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { isActive, isDeleted, IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { generateToken, verifyToken } from "./jwt";
import httpStatus from 'http-status-codes';

export const createUserTokens = (user: Partial<IUser>) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
    };

    const accessToken = generateToken(
        jwtPayload,
        envVars.jwtAccessSecret,
        envVars.jwtAccessExpires
    );

    const refreshToken = generateToken(
        jwtPayload,
        envVars.jwtRefreshSecret,
        envVars.jwtRefreshExpires
    );

    return {
        accessToken,
        refreshToken,
    };
};

export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {
    const verifiedRefreshToken = verifyToken(
        refreshToken,
        envVars.jwtRefreshSecret
    ) as JwtPayload;

    const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
    }

    if (
        isUserExist.isActive === isActive.BLOCKED ||
        isUserExist.isActive === isActive.INACTIVE
    ) {
        throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`);
    }

    if (isUserExist.isDeleted === isDeleted.DELETED) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role,
    };

    const accessToken = generateToken(
        jwtPayload,
        envVars.jwtAccessSecret,
        envVars.jwtAccessExpires
    );

    return { accessToken };
};
