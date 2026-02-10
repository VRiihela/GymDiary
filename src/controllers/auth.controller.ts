import type { Request, Response } from "express";
import bcrypt from "bcrypt"
import { User } from "../models/userModel.js"
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import type { RegisterInput, LoginInput } from "../schemas/auth.schema.js";


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
    const { email, password } = req.body as RegisterInput;

    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ error: "email is already in use" });

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({ email, passwordHash });

    return res.status(201).json({ id: user._id, email: user.email});
}

export async function login(req: Request, res: Response) {
    const { email, password } = req.body as LoginInput;
    
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
    await user.save();

    setRefreschtokenCookie(res, refreshToken);

    return res.status(200).json({ accessToken });
}

export async function refresh(req: Request, res: Response) {
    const token = req.cookies?.refreshToken as string | undefined;
    if(!token)  {
        return res.status(401).json({ error: "Missing refresh token" });
    }
    let payload: { sub: string, email: string };

    try {
        payload = verifyRefreshToken(token);
    }  catch {
        return res.status(401).json({ error: "Invalid refresh token" })
    }
    const user = await User.findById(payload.sub);
    if (!user || !user.refreshTokenHash)    {
        return res.status(401).json({ error: "Invalid session"});
    }

    const ok = await bcrypt.compare(token, user.refreshTokenHash);
    if(!ok) {
        return res.status(401).json({ error: "Invalid session" });
    }

    const newPayload = { sub: String(user._id), email: user.email };
    const accessToken = signRefreshToken(newPayload);
    const newRefreshToken = signRefreshToken(newPayload);

    user.refreshTokenHash = await bcrypt.hash(newRefreshToken, saltRounds);
    await user.save();
    setRefreschtokenCookie(res, newRefreshToken);

    return res.status(200).json({ accessToken })
}

export async function logout(req: Request, res: Response) {
  const token = req.cookies?.refreshToken as string | undefined;

  if (token) {
    try {
      const payload = verifyRefreshToken(token);
      await User.findByIdAndUpdate(payload.sub, { refreshTokenHash: null });
    } catch {
    }
  }

  res.clearCookie("refreshToken", { path: "/api/auth" });
  return res.status(204).send();
}