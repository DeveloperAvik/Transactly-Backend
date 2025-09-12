import mongoose from "mongoose"
import { TGenericErrorResponse } from "../interfaces/error.types"

export const handelCastError = (err: mongoose.Error.CastError): TGenericErrorResponse => {
    return {
        statusCode: 400,
        message: "Invalid MongoDB ObjectId. Please provide a valid id"
    }
}