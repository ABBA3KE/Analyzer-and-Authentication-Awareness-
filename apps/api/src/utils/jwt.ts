import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export interface TokenPayload {
  sub: string;
  role: "STUDENT" | "ADMIN";
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, env.jwtSecret) as TokenPayload;
}
