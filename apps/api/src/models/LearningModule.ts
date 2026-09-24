import { Schema, model } from "mongoose";

const learningModuleSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: { type: String, enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"], default: "BEGINNER" },
    objectives: { type: [String], default: [] },
    durationMin: { type: Number, default: 15 },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

learningModuleSchema.index({ isPublished: 1, order: 1 });

export const LearningModule = model("LearningModule", learningModuleSchema);
