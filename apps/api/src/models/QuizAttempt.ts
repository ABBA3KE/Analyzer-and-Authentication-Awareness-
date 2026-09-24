import { Schema, model, Types } from "mongoose";

// Each answer stores a small denormalised snapshot of the question (prompt,
// explanation, correct index, options) so results can be displayed without
// an extra join/populate — matches the shape the frontend expects.
const quizAnswerSchema = new Schema(
  {
    questionId: { type: Types.ObjectId, ref: "Question", required: true },
    selectedIndex: { type: Number, required: true },
    isCorrect: { type: Boolean, required: true },
    question: {
      prompt: { type: String, required: true },
      explanation: { type: String, required: true },
      correctIndex: { type: Number, required: true },
      options: { type: [String], required: true },
    },
  },
  { _id: false }
);

const quizAttemptSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    quizId: { type: Types.ObjectId, ref: "Quiz", required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    answers: { type: [quizAnswerSchema], default: [] },
  },
  { timestamps: true }
);

quizAttemptSchema.index({ userId: 1, quizId: 1 });

export const QuizAttempt = model("QuizAttempt", quizAttemptSchema);
