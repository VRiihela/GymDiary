import * as jwt from "jsonwebtoken";

export type JwtPayload = {
    sub: string;
    email: string;
}

function isJwtPayload(x: unknown): x is JwtPayload {
  if (!x || typeof x !== "object") return false;
  const obj = x as Record<string, unknown>;
  return typeof obj.sub === "string" && typeof obj.email === "string";
}

function mustGetEnv(name: string): string {
    const v = process.env[name];
    if (!v) throw new Error(`${name} missing from env`)
    return v;
}

const accessRaw = process.env.ACCESS_EXPIRES_IN;
const refreshRaw = process.env.ACCESS_EXPIRES_IN;
const ACCESS_SECRET: jwt.Secret = mustGetEnv("JWT_ACCESS_SECRET") ;
const REFRESH_SECRET: jwt.Secret = mustGetEnv("JWT_REFRESH_SECRET") ;
const ACCESS_EXPIRES_IN: number = accessRaw ? Number(accessRaw) : 900;
const REFRESH_EXPIRES_IN: number = refreshRaw ? Number(refreshRaw) : 604800;

export function signAccessToken(payload: JwtPayload ) {
    const options: jwt.SignOptions = { expiresIn: ACCESS_EXPIRES_IN };
  return jwt.sign(payload, ACCESS_SECRET, options);
}

export function signRefreshToken(payload: JwtPayload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
}

export function verifyRefreshToken(token: string): JwtPayload {
    const decoded = jwt.verify(token, REFRESH_SECRET);

    if (!isJwtPayload(decoded)) {
        throw new Error("Invalid token payload");
    }
  return decoded;
}