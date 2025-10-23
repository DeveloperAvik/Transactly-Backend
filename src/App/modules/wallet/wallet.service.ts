import { Wallet } from "./wallet.model";
import { IWallet } from "./wallet.interface";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";

const createWallet = async (payload: { user: string }) => {
  const existingWallet = await Wallet.findOne({ user: payload.user });
  if (existingWallet) {
    throw new AppError(httpStatus.BAD_REQUEST, "Wallet already exists for this user");
  }

  const wallet = new Wallet({
    user: payload.user,
    balance: 0,
    isBlocked: false,
  });

  return await wallet.save();
};

const getWalletByUserId = async (userId: string) => {
  const wallet = await Wallet.findOne({ user: userId }).populate("user");
  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found for this user");
  }
  return wallet;
};

const getAllWallets = async () => {
  return await Wallet.find().populate("user");
};

export const WalletService = {
  createWallet,
  getWalletByUserId,
  getAllWallets,
};
