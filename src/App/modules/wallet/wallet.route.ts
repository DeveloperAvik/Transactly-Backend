import { Router } from "express";
import { WalletController } from "./wallet.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { WalletValidation } from "./wallet.validation";

const router = Router();

router.post(
    "/create",
    validateRequest(WalletValidation.createWalletZodSchema),
    WalletController.createWallet
);

router.get("/:userId", WalletController.getWalletByUserId);

router.get("/", WalletController.getAllWallets);

export const WalletRoutes = router;
