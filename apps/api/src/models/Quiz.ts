import { Schema, model, Types } from "mongoose";

const quizSchema = new Schema(
  {
    moduleId: { type: Types.ObjectId, ref: "LearningModule", default: null },
    title: { type: String, required: true },
    description: { type: String },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

quizSchema.index({ moduleId: 1 });

export const Quiz = model("Quiz", quizSchema);
