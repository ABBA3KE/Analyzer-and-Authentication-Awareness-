import { describe, it, expect } from "vitest";
import { registerSchema, loginSchema } from "../validators/auth.validators.js";

describe("registerSchema", () => {
  it("rejects a password shorter than 10 characters", () => {
    const result = registerSchema.safeParse({ email: "a@b.com", password: "short1", fullName: "A B" });
    expect(result.success).toBe(false);
  });

  it("accepts a valid registration payload", () => {
    const result = registerSchema.safeParse({ email: "student@example.com", password: "a-long-passphrase", fullName: "Demo Student" });
    expect(result.success).toBe(true);
  });

  it("lowercases and trims email", () => {
    const result = registerSchema.safeParse({ email: "  Student@Example.com  ", password: "a-long-passphrase", fullName: "Demo Student" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe("student@example.com");
  });

  it("does not enforce composition rules beyond length", () => {
    const result = registerSchema.safeParse({ email: "a@b.com", password: "alllowercaseletters", fullName: "A B" });
    expect(result.success).toBe(true);
  });
});

describe("loginSchema", () => {
  it("rejects an invalid email", () => {
    const result = loginSchema.safeParse({ email: "not-an-email", password: "x" });
    expect(result.success).toBe(false);
  });
});
