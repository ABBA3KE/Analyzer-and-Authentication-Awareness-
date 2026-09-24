import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { env } from "../config/env.js";

// Central error handler. Never leaks stack traces, DB internals, or secrets
// to the client, regardless of environment.
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (!env.isProd) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  return res.status(500).json({ error: "Something went wrong. Please try again." });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: `No route for ${req.method} ${req.path}` });
}
