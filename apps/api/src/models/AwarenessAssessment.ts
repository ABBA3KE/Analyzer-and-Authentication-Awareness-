import { Schema, model, Types } from "mongoose";

const awarenessResponseSchema = new Schema(
  {
    topic: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
  },
  { _id: false }
);

const awarenessAssessmentSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["PRE_TEST", "POST_TEST"], required: true },
    scorePercent: { type: Number, required: true },
    takenAt: { type: Date, default: Date.now },
    responses: { type: [awarenessResponseSchema], default: [] },
  },
  { timestamps: true }
);

awarenessAssessmentSchema.index({ userId: 1, type: 1 });

export const AwarenessAssessment = model("AwarenessAssessment", awarenessAssessmentSchema);
