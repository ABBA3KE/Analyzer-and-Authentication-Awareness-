import type { Request, Response } from "express";
import { registerStudent, verifyCredentials, getUserWithProfile } from "../services/auth.service.js";
import { signToken } from "../utils/jwt.js";
import { env } from "../config/env.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

function setSessionCookie(res: Response, token: string) {
  res.cookie(env.cookieName, token, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await registerStudent(req.body);
  const token = signToken({ sub: user.id, role: user.role as "STUDENT" | "ADMIN" });
  setSessionCookie(res, token);
  res.status(201).json({
    user: { id: user.id, email: user.email, role: user.role, fullName: user.profile?.fullName },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const user = await verifyCredentials(req.body);
  const token = signToken({ sub: user.id, role: user.role as "STUDENT" | "ADMIN" });
  setSessionCookie(res, token);
  res.json({ user: { id: user.id, email: user.email, role: user.role } });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie(env.cookieName);
  res.status(204).send();
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Authentication required.", 401);
  const user = await getUserWithProfile(req.user.sub);
  if (!user) throw new AppError("Authentication required.", 401);
  res.json({
    id: user.id,
    email: user.email,
    role: user.role,
    // The embedded profile subdocument carries `id` from its parent user,
    // so the shape matches the frontend's StudentProfile type exactly.
    profile: user.profile ? { id: user.id, ...user.profile } : null,
  });
});