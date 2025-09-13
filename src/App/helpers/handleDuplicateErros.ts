import { TGenericErrorResponse } from "../interfaces/error.types";

export const handleDuplicateError = (err: any): TGenericErrorResponse => {
    let value = "";

    const matchedArray = err.message.match(/"([^"]*)"/);
    if (matchedArray && matchedArray[1]) {
        value = matchedArray[1];
    }

    if (err.keyValue) {
        value = Object.values(err.keyValue)[0] as string;
    }

    return {
        statusCode: 400,
        message: `${value} already exists`,
    };
};
