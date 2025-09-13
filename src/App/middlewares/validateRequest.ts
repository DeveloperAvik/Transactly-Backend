import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

type ValidationType = "body" | "query" | "params";

export const validateRequest =
    (schema: AnyZodObject, type: ValidationType = "body") =>
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const dataToValidate =
                    type === "body" ? req.body : type === "query" ? req.query : req.params;

                const parsedData = await schema.parseAsync(dataToValidate);

                if (type === "body") req.body = parsedData;
                else if (type === "query") req.query = parsedData;
                else req.params = parsedData;

                next();
            } catch (error) {
                if (error instanceof ZodError) {
                    return next(error);
                }
                next(error);
            }
        };
