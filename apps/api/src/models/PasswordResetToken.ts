import { Schema, model, Types } from "mongoose";

const passwordResetTokenSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date },
  },
  { timestamps: true }
);

passwordResetTokenSchema.index({ userId: 1 });

export const PasswordResetToken = model("PasswordResetToken", passwordResetTokenSchema);
