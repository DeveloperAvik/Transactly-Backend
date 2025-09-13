import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import mongoose from "mongoose";
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.types";
import { zodError } from "../helpers/handleZodError";
import { validationError } from "../helpers/handelValidationError";
import { handelCastError } from "../helpers/handelCastError";
import { handleDuplicateError } from '../helpers/handleDuplicateErros';

export const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let errorSources: TErrorSources[] = [];
    let statusCode = 500;
    let message = "Something went wrong";

    // Duplicate key error
    if (err.code === 11000) {
        const simplifyDuplicateError = handleDuplicateError(err);
        statusCode = simplifyDuplicateError.statusCode;
        message = simplifyDuplicateError.message;
    }

    // Zod error
    else if (err.name === "ZodError") {
        const simplifyZodError = zodError(err);
        statusCode = simplifyZodError.statusCode;
        message = simplifyZodError.message;
        errorSources = simplifyZodError.errorSources || [];
    }

    // Mongoose validation error
    else if (err instanceof mongoose.Error.ValidationError) {
        const simpleValidationError = validationError(err);
        statusCode = simpleValidationError.statusCode;
        message = simpleValidationError.message;
        errorSources = simpleValidationError.errorSources || [];
    }

    // Mongoose cast error
    else if (err instanceof mongoose.Error.CastError) {
        const simplyfiedCastError = handelCastError(err);
        statusCode = simplyfiedCastError.statusCode;
        message = simplyfiedCastError.message;
    }

    // Custom AppError
    else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    // Generic error
    else if (err instanceof Error) {
        message =
            envVars.nodeEnv === "development"
                ? err.message
                : "Internal Server Error";
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
