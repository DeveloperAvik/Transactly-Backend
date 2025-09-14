import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { TransactionValidation } from "./transaction.validation";

const router = Router();

router.post(
    "/deposit",
    validateRequest(TransactionValidation.depositTransactionZodSchema),
    TransactionController.deposit
);

router.post(
    "/withdraw",
    validateRequest(TransactionValidation.withdrawTransactionZodSchema),
    TransactionController.withdraw
);

router.post(
    "/transfer",
    validateRequest(TransactionValidation.transferTransactionZodSchema),
    TransactionController.transfer
);

router.get("/:walletId", TransactionController.getWalletTransactions);
router.get("/", TransactionController.getAllTransactions);

export const TransactionRoutes = router;
