import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodRawShape, ZodError } from "zod";
import { ParsedQs } from "qs";
import { ParamsDictionary } from "express-serve-static-core";

type ValidationType = "body" | "query" | "params";

export const validateRequest =
    (schema: ZodObject<ZodRawShape>, type: ValidationType = "body") =>
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const dataToValidate =
                    type === "body" ? req.body : type === "query" ? req.query : req.params;

                const parsedData = await schema.parseAsync(dataToValidate);

                if (type === "body") req.body = parsedData;
                else if (type === "query") req.query = parsedData as ParsedQs;
                else req.params = parsedData as ParamsDictionary;

                next();
            } catch (error) {
                if (error instanceof ZodError) return next(error);
                next(error);
            }
        };
