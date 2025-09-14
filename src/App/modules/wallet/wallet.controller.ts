import { Request, Response } from "express";
import { WalletService } from "./wallet.service";
import { sendResponse } from "../../utils/sendRespose";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsyncs";

const createWallet = catchAsync(async (req: Request, res: Response) => {
    const result = await WalletService.createWallet(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Wallet created successfully",
        data: result,
    });
});

const getWalletByUserId = catchAsync(async (req: Request, res: Response) => {
    const result = await WalletService.getWalletByUserId(req.params.userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Wallet retrieved successfully",
        data: result,
    });
});

const getAllWallets = catchAsync(async (req: Request, res: Response) => {
    const result = await WalletService.getAllWallets();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All wallets retrieved successfully",
        data: result,
    });
});

export const WalletController = {
    createWallet,
    getWalletByUserId,
    getAllWallets,
};
