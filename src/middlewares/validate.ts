import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodType } from "zod";

export function validateBody<T>(schema: ZodType<T>) {
    return (req: Request, res: Response, next: NextFunction)    => {
        try {
            const parsed= schema.parse(req.body);
            req.body = parsed as T;
            return next();
        } catch (err) {
            if (err instanceof ZodError)    {
                return res.status(400).json({
                    error: "Validation error",
                    details: err.issues.map((i)  => ({
                        path: i.path.join("."),
                        message: i.message,
                    })),
                });
            }
            return next(err);
        }
    };
}