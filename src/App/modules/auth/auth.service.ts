import AppError from "../../errorHelpers/AppError";
import { isActive, isDeleted, IUser } from "../user/user.interface"
import { User } from "../user/user.model";
import httpStatus from 'http-status-codes';
import bcryptjs from 'bcryptjs';
import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../../utils/userTokens";
import { generateToken, verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";


const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload;

    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email doesnot Exist")
    }

    const isPasswordMatch = await bcryptjs.compare(password as string, isUserExist.password as string)

    if (!isPasswordMatch) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Passoerd")
    }


    const userTokens = createUserTokens(isUserExist)
    const { password: pass, ...rest } = isUserExist.toObject();


    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest
    }
}

const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)
    return {
        accessToken: newAccessToken
    }
}


const resetPassword = async (OldPassword: string, newPassword: string, decodedToken: JwtPayload) => {

    const user = await User.findById(decodedToken.userId)

    const isOldPasswordMatch = await bcryptjs.compare(OldPassword, user!.password as string)

    if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Old password doesnot match");
    }

    user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))

    user!.save();

}

export const AuthServices = {
    credentialsLogin,
    getNewAccessToken,
    resetPassword
}