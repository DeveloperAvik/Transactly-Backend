import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import mongoose from "mongoose";
import { TErrorSources } from "../interfaces/error.types";
import { zodError } from "../helpers/handleZodError";
import { validationError } from "../helpers/handelValidationError";
import { handelCastError } from "../helpers/handelCastError";
import { handleDuplicateError } from "../helpers/handleDuplicateErros";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let errorSources: TErrorSources[] = [];
  let statusCode = 500;
  let message = "Something went wrong";

  if (err.code === 11000) {
    const simplifiedDuplicateError = handleDuplicateError(err);
    statusCode = simplifiedDuplicateError.statusCode;
    message = simplifiedDuplicateError.message;
  } else if (err.name === "ZodError") {
    const simplifiedZodError = zodError(err);
    statusCode = simplifiedZodError.statusCode;
    message = simplifiedZodError.message;
    errorSources = simplifiedZodError.errorSources || [];
  } else if (err instanceof mongoose.Error.ValidationError) {
    const simplifiedValidationError = validationError(err);
    statusCode = simplifiedValidationError.statusCode;
    message = simplifiedValidationError.message;
    errorSources = simplifiedValidationError.errorSources || [];
  } else if (err instanceof mongoose.Error.CastError) {
    const simplifiedCastError = handelCastError(err);
    statusCode = simplifiedCastError.statusCode;
    message = simplifiedCastError.message;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message =
      envVars.nodeEnv === "development" ? err.message : "Internal Server Error";
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    ...(envVars.nodeEnv === "development" && {
      error: err,
      stack: err.stack,
    }),
  });
};
