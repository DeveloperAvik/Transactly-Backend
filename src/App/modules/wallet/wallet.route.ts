import { Router } from "express";
import { WalletController } from "./wallet.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { WalletValidation } from "./wallet.validation";

const router = Router();

// Create wallet
router.post(
    "/create",
    validateRequest(WalletValidation.createWalletZodSchema),
    WalletController.createWallet
);

// Get wallet by user ID
router.get("/:userId", WalletController.getWalletByUserId);

// Get all wallets
router.get("/", WalletController.getAllWallets);

export const WalletRoutes = router;
