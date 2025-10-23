import { Router } from "express";
import { OtpController } from "./otp.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { OtpValidation } from "./otp.validation";

const router = Router();

router.post("/send", validateRequest(OtpValidation.sendOtpZodSchema), OtpController.sendOtp);
router.post("/verify", validateRequest(OtpValidation.verifyOtpZodSchema), OtpController.verifyOtp);

export const OtpRoutes = router;
