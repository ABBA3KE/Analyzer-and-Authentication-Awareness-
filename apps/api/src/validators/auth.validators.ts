import { z } from "zod";

// Deliberately no upper/lower/symbol composition rules (see spec section 17) —
// we encourage length over arbitrary complexity, matching NIST guidance.
export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(10, "Use at least 10 characters — a short passphrase works well."),
  fullName: z.string().trim().min(2, "Enter your full name."),
  studentId: z.string().trim().min(1).optional(),
  department: z.string().trim().optional(),
  polytechnic: z.string().trim().optional(),
  level: z.string().trim().optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
