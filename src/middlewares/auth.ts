import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken, type JwtPayload } from "../utils/jwt.js";

// Allow req.user in Express Request type
declare global {
    namespace Express   {
        interface Request   {
            user?: JwtPayload
        }
    }
}

export function requireAuth(req: Request, res: Response, next: NextFunction)   {
    const header = req.headers.authorization;

    if(!header || !header.startsWith("Bearer "))    {
        return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }
    const token = header.slice("Bearer ".length).trim();

    try {
        const payload = verifyAccessToken(token);
        req.user = payload;
        next();
    } catch (err)  {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}