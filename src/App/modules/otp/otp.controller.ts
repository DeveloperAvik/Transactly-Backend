import { Request, Response } from "express";
import { OtpService } from "./otp.service";
import { catchAsync } from "../../utils/catchAsyncs";
import { sendResponse } from "../../utils/sendRespose";
import httpStatus from "http-status-codes";

export const OtpController = {
  sendOtp: catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await OtpService.sendOtp(email);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "OTP sent successfully",
      data: result,
    });
  }),

  verifyOtp: catchAsync(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    const result = await OtpService.verifyOtp(email, otp);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "OTP verified successfully",
      data: result,
    });
  }),
};
