import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsyncs";
import { sendResponse } from '../../utils/sendRespose';
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.createUser(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User created successfully",
        data: result,
    });
});

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const verifiedToken = req.user; // set by auth middleware
    const payload = req.body;

    const result = await UserServices.updateUser(userId, payload, verifiedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User updated successfully",
        data: result,
    });
});

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Users retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});

export const UserController = {
    createUser,
    updateUser,
    getAllUsers,
};
