import { Schema, model, type InferSchemaType } from "mongoose";

const studentProfileSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    studentId: { type: String, trim: true },
    department: { type: String, trim: true },
    polytechnic: { type: String, trim: true },
    level: { type: String, trim: true },
    photoUrl: { type: String, trim: true },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // select: false keeps the hash out of normal queries; verifyCredentials()
    // explicitly opts in with .select("+passwordHash").
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["STUDENT", "ADMIN"], default: "STUDENT" },
    isActive: { type: Boolean, default: true },
    profile: studentProfileSchema,
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });

export type UserDoc = InferSchemaType<typeof userSchema>;
export const User = model("User", userSchema);
