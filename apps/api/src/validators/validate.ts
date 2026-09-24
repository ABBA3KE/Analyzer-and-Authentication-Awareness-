import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { AppError } from "../utils/AppError.js";

// Generic body validator: parses + replaces req.body with the typed, sanitised
// result, or throws a 400 with the first readable Zod issue.
export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues[0]?.message ?? "Invalid input.";
      return next(new AppError(message, 422));
    }
    req.body = result.data;
    next();
  };
}
