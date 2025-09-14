import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { TransactionService } from "./transaction.service";
import { catchAsync } from "../../utils/catchAsyncs";
import { sendResponse } from "../../utils/sendRespose";

const deposit = catchAsync(async (req: Request, res: Response) => {
    const { walletId, amount } = req.body;
    const result = await TransactionService.deposit(walletId, amount);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Deposit successful",
        data: result,
    });
});

const withdraw = catchAsync(async (req: Request, res: Response) => {
    const { walletId, amount } = req.body;
    const result = await TransactionService.withdraw(walletId, amount);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Withdrawal successful",
        data: result,
    });
});

const transfer = catchAsync(async (req: Request, res: Response) => {
    const { fromWalletId, toWalletId, amount } = req.body;
    const result = await TransactionService.sendMoney(fromWalletId, toWalletId, amount);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Transfer successful",
        data: result,
    });
});

const getWalletTransactions = catchAsync(async (req: Request, res: Response) => {
    const { walletId } = req.params;
    const result = await TransactionService.getTransactionsByWalletId(walletId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Wallet transactions retrieved successfully",
        data: result,
    });
});

const getAllTransactions = catchAsync(async (req: Request, res: Response) => {
    const result = await TransactionService.getAllTransactions();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All transactions retrieved successfully",
        data: result,
    });
});

export const TransactionController = {
    deposit,
    withdraw,
    transfer,
    getWalletTransactions,
    getAllTransactions,
};
