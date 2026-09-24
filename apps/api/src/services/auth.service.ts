import argon2 from "argon2";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import type { RegisterInput, LoginInput } from "../validators/auth.validators.js";

export async function registerStudent(input: RegisterInput) {
  const existing = await User.findOne({ email: input.email });
  if (existing) {
    // Generic message: does not confirm whether the email exists to an attacker.
    throw new AppError("Unable to create account with those details.", 409);
  }

  const passwordHash = await argon2.hash(input.password, { type: argon2.argon2id });

  const user = await User.create({
    email: input.email,
    passwordHash,
    role: "STUDENT",
    profile: {
      fullName: input.fullName,
      studentId: input.studentId,
      department: input.department,
      polytechnic: input.polytechnic,
      level: input.level,
    },
  });

  return user;
}

export async function verifyCredentials(input: LoginInput) {
  const user = await User.findOne({ email: input.email }).select("+passwordHash");
  // Same generic error whether the email is unknown or the password is wrong,
  // and whether the account is disabled — avoids user enumeration.
  const genericError = new AppError("Incorrect email or password.", 401);

  if (!user || !user.isActive) throw genericError;

  const valid = await argon2.verify(user.passwordHash, input.password);
  if (!valid) throw genericError;

  return user;
}

export async function getUserWithProfile(userId: string) {
  return User.findById(userId);
}
