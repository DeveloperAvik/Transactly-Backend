import { Wallet } from "./wallet.model";
import { IWallet } from "./wallet.interface";

const createWallet = async (payload: { user: string }) => {

    const existingWallet = await Wallet.findOne({ user: payload.user });
    if (existingWallet) {
        throw new Error("Wallet already exists for this user");
    }

    const wallet = new Wallet({
        user: payload.user,
        balance: 0,
    });

    return await wallet.save();
};

const getWalletByUserId = async (userId: string) => {
    return await Wallet.findOne({ user: userId }).populate("user");
};

const getAllWallets = async () => {
    return await Wallet.find().populate("user");
};

export const WalletService = {
    createWallet,
    getWalletByUserId,
    getAllWallets,
};
