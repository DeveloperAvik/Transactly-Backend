import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.types";

export const zodError = (err: any): TGenericErrorResponse => {
    const errorSources: TErrorSources[] = []


    err.issues.forEach((issue: any) => {
        errorSources.push({
            path: issue.path.reverse().join("inside"),
            message: issue.message
        })
    });

    return {
        statusCode: 400,
        message: "Zod Error",
        errorSources
    }
}