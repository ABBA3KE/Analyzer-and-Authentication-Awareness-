import { Schema, model, Types } from "mongoose";

const questionSchema = new Schema(
  {
    quizId: { type: Types.ObjectId, ref: "Quiz", required: true },
    type: { type: String, enum: ["MULTIPLE_CHOICE", "TRUE_FALSE"], default: "MULTIPLE_CHOICE" },
    prompt: { type: String, required: true },
    options: { type: [String], required: true },
    correctIndex: { type: Number, required: true },
    explanation: { type: String, required: true },
    topic: { type: String, required: true },
    difficulty: { type: String, enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"], default: "BEGINNER" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

questionSchema.index({ quizId: 1, order: 1 });

export const Question = model("Question", questionSchema);
