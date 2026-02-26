import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodType } from "zod";

function toValidationError(res: Response, err: ZodError) {
    return res.status(400).json({
        error: "Validation error",
        details: err.issues.map((i)  => ({
            path: i.path.join("."),
            message: i.message,
        })),
    });
}

export function validateBody<T>(schema: ZodType<T>) {
    return (req: Request, res: Response, next: NextFunction)    => {
        try {
            const parsed= schema.parse(req.body);
            req.body = parsed as T;
            return next();
        } catch (err) {
            if (err instanceof ZodError)    {
                return toValidationError(res, err);
            }
            return next(err);
        }
    };
}

export function validateParams<T>(schema: ZodType<T>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = schema.parse(req.params);
            req.params = parsed as Request["params"];
            return next();
        } catch (err) {
            if (err instanceof ZodError) {
                return toValidationError(res, err);
            }
            return next(err);
        }
    };
}
