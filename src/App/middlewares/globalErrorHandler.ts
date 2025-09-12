import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/AppError";
import mongoose from "mongoose";
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.types";
import { handelDuplicateError } from "../helpers/handleDuplicateError";
import { zodError } from "../helpers/handleZodError";
import { validationError } from "../helpers/handleValidationError";
import { handelCastError } from "../helpers/handleCastError";




export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    let errorSources: any = [];

    let statusCode = 500;
    let message = `Something Went Wrong`;



    if (err.code === 11000) {
        const simplifyDuplicateError = handelDuplicateError(err);
        statusCode = simplifyDuplicateError.statusCode
        message = simplifyDuplicateError.message
    }

    else if (err.name === "ZodError") {

        const simplifyZodError = zodError(err)

        statusCode = simplifyZodError.statusCode;
        message = simplifyZodError.message
        errorSources = simplifyZodError.errorSources
    }

    else if (err.name === "ValidationError") {

        const simpleValidationError = validationError(err);

        statusCode = simpleValidationError.statusCode,
            errorSources = simpleValidationError.errorSources
        message = "Validation Error"
    }

    else if (err.name === "CastError") {
        const simplyfiedCastError = handelCastError(err);
        statusCode = simplyfiedCastError.statusCode
        message = simplyfiedCastError.message
    }

    else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err: envVars.nodeEnv === "development" ? err : null,
        stack: envVars.nodeEnv === "development" ? err.stack : null
    })
}