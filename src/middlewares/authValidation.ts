import type { Request, Response, NextFunction } from "express";
import validator from "validator";

export function validateRegister(req:Request, res:Response, next: NextFunction) {
    const email = validator.normalizeEmail(validator.trim(String(req.body.email ?? ""))) || "";
    const password = String(req.body.password ?? "");

    req.body.email = email;
    req.body.password = password;

    if (!validator.isEmail(email))  {
     return res.status(400).json({ message: "Invalid email" });   
    }

    if(password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }
    next();
}

export function validateLogin(req: Request, res: Response, next: NextFunction) {
  const email = validator.normalizeEmail(validator.trim(String(req.body.email ?? ""))) || "";
  const password = String(req.body.password ?? "");

  req.body.email = email;
  req.body.password = password;

  if (!validator.isEmail(email) || !password) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  next();
}