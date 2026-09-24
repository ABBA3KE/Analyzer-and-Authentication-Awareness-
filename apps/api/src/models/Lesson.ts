import { Schema, model, Types } from "mongoose";

const lessonSchema = new Schema(
  {
    moduleId: { type: Types.ObjectId, ref: "LearningModule", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    keyTakeaways: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

lessonSchema.index({ moduleId: 1, order: 1 });

export const Lesson = model("Lesson", lessonSchema);
