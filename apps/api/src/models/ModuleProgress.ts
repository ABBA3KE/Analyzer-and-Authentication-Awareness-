import { Schema, model, Types } from "mongoose";

const moduleProgressSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    moduleId: { type: Types.ObjectId, ref: "LearningModule", required: true },
    percentComplete: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
    lastAccessed: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

moduleProgressSchema.index({ userId: 1, moduleId: 1 }, { unique: true });

export const ModuleProgress = model("ModuleProgress", moduleProgressSchema);
