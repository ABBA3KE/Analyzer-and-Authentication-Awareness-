import type { NextFunction, Request, Response } from "express";
import { verifyToken, type TokenPayload } from "../utils/jwt.js";
import { AppError } from "../utils/AppError.js";
import { env } from "../config/env.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

// Reads the session cookie, verifies it, and attaches the user to the request.
// Rejects with a generic message so token issues never leak internal detail.
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[env.cookieName];
  if (!token) return next(new AppError("Authentication required.", 401));
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    next(new AppError("Session expired. Please log in again.", 401));
  }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) return next(new AppError("Authentication required.", 401));
  if (req.user.role !== "ADMIN") {
    return next(new AppError("Admins only.", 403));
  }
  next();
}
