import mongoose from "mongoose";
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.types";

export const validationError = (
  err: mongoose.Error.ValidationError
): TGenericErrorResponse => {
  const errorSources: TErrorSources[] = Object.values(err.errors).map(
    (errorObject) => ({
      path: (errorObject as mongoose.Error.ValidatorError).path || "",
      message: errorObject.message || "Validation failed",
    })
  );

  return {
    statusCode: 400,
    message: "Validation error",
    errorSources,
  };
};
