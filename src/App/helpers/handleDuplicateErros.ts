import { TGenericErrorResponse } from "../interfaces/error.types"

export const handelDuplicateError = (err: any): TGenericErrorResponse => {
    const matchedArray = err.message.match(/"([^"]*)"/)

    return {
        statusCode: 400,
        message: `${matchedArray[1]} alredy exist`
    }

}