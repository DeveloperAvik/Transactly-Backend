import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
// import { Wallet } from "../wallet/wallet.model";

const INITIAL_BALANCE = 50;

const createUser = async (payload: Partial<IUser>) => {
    const { email, password, role = Role.USER, ...rest } = payload;

    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `User with email ${email} already exists`
        );
    }

    const hashedPassword = await bcryptjs.hash(
        password as string,
        Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
        provider: "credentials",
        providerId: email!,
    };

    const user = await User.create({
        email,
        password: hashedPassword,
        role,
        auths: [authProvider],
        ...rest,
    });

    // Auto-create wallet
    // if (user.role === Role.USER || user.role === Role.AGENT) {
    //     await Wallet.create({
    //         user: user._id,
    //         balance: INITIAL_BALANCE,
    //         isBlocked: false,
    //     });
    // }

    const { password: _, ...safeUser } = user.toObject();
    return { user: safeUser };
};

const updateUser = async (
    userId: string,
    payload: Partial<IUser>,
    decodedToken: JwtPayload
) => {
    const ifUserExist = await User.findById(userId);
    if (!ifUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
    }

    if (payload.role) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }

        if (payload.role === Role.SUPERADMIN && decodedToken.role === Role.ADMIN) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }

    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }

    if (payload.password) {
        payload.password = await bcryptjs.hash(
            payload.password,
            Number(envVars.BCRYPT_SALT_ROUND)
        );
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });

    return newUpdatedUser;
};

const getAllUsers = async (page = 1, limit = 10) => {
    const users = await User.find({})
        .skip((page - 1) * limit)
        .limit(limit);

    const totalUsers = await User.countDocuments();

    return {
        data: users.map((u) => {
            const { password, ...safeUser } = u.toObject();
            return safeUser;
        }),
        meta: {
            total: totalUsers,
            page,
            limit,
        },
    };
};

export const UserServices = { createUser, getAllUsers, updateUser };
