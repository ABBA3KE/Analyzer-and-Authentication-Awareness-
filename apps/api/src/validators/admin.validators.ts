import { z } from "zod";

export const moduleSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only."),
  description: z.string().min(10),
  category: z.string().min(2),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).default("BEGINNER"),
  objectives: z.array(z.string()).default([]),
  durationMin: z.number().int().positive().default(15),
  order: z.number().int().default(0),
  isPublished: z.boolean().default(false),
});

export const lessonSchema = z.object({
  moduleId: z.string(),
  title: z.string().min(3),
  content: z.string().min(10),
  keyTakeaways: z.array(z.string()).default([]),
  order: z.number().int().default(0),
});

export const quizSchema = z.object({
  moduleId: z.string().optional(),
  title: z.string().min(3),
  description: z.string().optional(),
  isPublished: z.boolean().default(false),
});

export const questionSchema = z.object({
  quizId: z.string(),
  type: z.enum(["MULTIPLE_CHOICE", "TRUE_FALSE"]).default("MULTIPLE_CHOICE"),
  prompt: z.string().min(5),
  options: z.array(z.string()).min(2),
  correctIndex: z.number().int().min(0),
  explanation: z.string().min(5),
  topic: z.string().min(2),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).default("BEGINNER"),
  order: z.number().int().default(0),
});
