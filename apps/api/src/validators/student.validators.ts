import { z } from "zod";

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(2).optional(),
  studentId: z.string().trim().optional(),
  department: z.string().trim().optional(),
  polytechnic: z.string().trim().optional(),
  level: z.string().trim().optional(),
  photoUrl: z.string().url().optional(),
});

export const moduleProgressSchema = z.object({
  percentComplete: z.number().int().min(0).max(100),
});

export const quizAttemptSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string(),
      selectedIndex: z.number().int().min(0),
    })
  ).min(1, "Answer at least one question."),
});

export const assessmentSchema = z.object({
  type: z.enum(["PRE_TEST", "POST_TEST"]),
  responses: z.array(
    z.object({
      topic: z.string(),
      isCorrect: z.boolean(),
    })
  ).min(1),
});
