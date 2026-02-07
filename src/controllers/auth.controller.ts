import type { Request, Response } from "express";
import bcrypt from "bcrypt"
import { User } from "../models/userModel.js"
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";


const saltRounds = 12

function setRefreschtokenCookie(res: Response, token: string)    {
    res.cookie("refreshToken", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/api/auth",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7d ms
    });
}

export async function register(req: Request, res: Response) {
    
    const { email, password } = req.body as { email?: string; password?: string};

    if(!email || !password)  {
        return res.status(400).json({ error: "email and password required" });
    }

    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ error: "email is already in use" });

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({ email, passwordHash });

    return res.status(200).json({ id: user._id, email: user.email});
}

export async function login(req: Request, res: Response) {
    
    const { email, password } = req.body as { email?: string, password?:string };
    
    if(!email || !password)  {
        return res.status(400).json({ error: "email and password required" });
    }

    const user = await User.findOne({ email });
    if(!user)   {
        return res.status(401).json({ error: "Invalid credentials" })
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if(!ok) {
        return res.status(401).json({ error: "Invalid credentials" })
    }

    const payload = { sub: String(user._id), email: user.email };
    const accessToken = signAccessToken(payload)
    const refreshToken = signRefreshToken(payload)

    user.refreshTokenHash = await bcrypt.hash(refreshToken, saltRounds);

    setRefreschtokenCookie(res, refreshToken);

    return res.status(200).json({ accessToken });
}