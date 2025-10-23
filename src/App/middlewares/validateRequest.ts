import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodRawShape, ZodError } from "zod";
import { ParsedQs } from "qs";
import { ParamsDictionary } from "express-serve-static-core";

type ValidationType = "body" | "query" | "params";

/**
 * ✅ Enhanced validator – works for both:
 * - z.object({ body: z.object({...}) })
 * - z.object({...})
 */
export const validateRequest =
  (schema: ZodObject<ZodRawShape>, type: ValidationType = "body") =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const target =
        type === "body" ? req.body : type === "query" ? req.query : req.params;

      // 🔍 Support both { body: z.object() } and flat z.object() schemas
      const parsedData =
        (schema as any).shape?.body
          ? await (schema as any).shape.body.parseAsync(target)
          : await schema.parseAsync(target);

      if (type === "body") req.body = parsedData;
      else if (type === "query") req.query = parsedData as ParsedQs;
      else req.params = parsedData as ParamsDictionary;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(error);
      }
      next(error);
    }
  };
