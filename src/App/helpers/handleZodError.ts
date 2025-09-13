import { ZodError } from "zod";
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.types";

export const zodError = (err: ZodError): TGenericErrorResponse => {
    const errorSources: TErrorSources[] = err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
    }));

    return {
        statusCode: 400,
        message: "Validation error from Zod",
        errorSources,
    };
};
