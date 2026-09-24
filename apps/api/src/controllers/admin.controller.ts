import type { Request, Response } from "express";
import { User } from "../models/User.js";
import { LearningModule } from "../models/LearningModule.js";
import { Lesson } from "../models/Lesson.js";
import { Quiz } from "../models/Quiz.js";
import { Question } from "../models/Question.js";
import { QuizAttempt } from "../models/QuizAttempt.js";
import { ModuleProgress } from "../models/ModuleProgress.js";
import { AwarenessAssessment } from "../models/AwarenessAssessment.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { toClient, toClientList } from "../utils/serialize.js";

// ---- Students ----
// NOTE: passwordHash has `select: false` on the schema, so it is never
// returned here — admins can never see or recover student passwords.
export const listStudents = asyncHandler(async (req: Request, res: Response) => {
  const search = (req.query.search as string | undefined)?.trim();
  const filter: Record<string, unknown> = { role: "STUDENT" };
  if (search) {
    const re = new RegExp(search, "i");
    filter.$or = [{ email: re }, { "profile.fullName": re }];
  }
  const users = await User.find(filter).sort({ createdAt: -1 });
  res.json(
    users.map((u) => ({
      id: u.id,
      email: u.email,
      isActive: u.isActive,
      createdAt: u.createdAt,
      studentProfile: u.profile ? { ...u.profile } : null,
    }))
  );
});

export const getStudentDetail = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findOne({ _id: req.params.id, role: "STUDENT" });
  if (!user) throw new AppError("Student not found.", 404);

  const [moduleProgress, quizAttempts, awarenessAssessments] = await Promise.all([
    ModuleProgress.find({ userId: user._id }).populate("moduleId"),
    QuizAttempt.find({ userId: user._id }).populate("quizId").sort({ completedAt: -1 }),
    AwarenessAssessment.find({ userId: user._id }),
  ]);

  res.json({
    id: user.id,
    email: user.email,
    isActive: user.isActive,
    createdAt: user.createdAt,
    studentProfile: user.profile ? { ...user.profile } : null,
    moduleProgress: moduleProgress.map((mp) => ({
      ...toClient(mp as any),
      module: mp.moduleId && typeof mp.moduleId === "object" ? toClient(mp.moduleId as any) : null,
    })),
    quizAttempts: quizAttempts.map((qa) => ({
      ...toClient(qa as any),
      quiz: qa.quizId && typeof qa.quizId === "object" ? toClient(qa.quizId as any) : null,
    })),
    awarenessAssessments: toClientList(awarenessAssessments as any),
  });
});

export const setStudentActive = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: Boolean(req.body.isActive) },
    { new: true }
  );
  if (!user) throw new AppError("Student not found.", 404);
  res.json({ id: user.id, isActive: user.isActive });
});

// ---- Modules ----
export const createModule = asyncHandler(async (req: Request, res: Response) => {
  const module = await LearningModule.create(req.body);
  res.status(201).json(toClient(module as any));
});

export const updateModule = asyncHandler(async (req: Request, res: Response) => {
  const module = await LearningModule.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!module) throw new AppError("Module not found.", 404);
  res.json(toClient(module as any));
});

export const deleteModule = asyncHandler(async (req: Request, res: Response) => {
  const module = await LearningModule.findByIdAndDelete(req.params.id);
  if (!module) throw new AppError("Module not found.", 404);
  // Mongo has no cascading deletes — clean up dependents explicitly.
  await Promise.all([
    Lesson.deleteMany({ moduleId: module._id }),
    Quiz.deleteMany({ moduleId: module._id }),
    ModuleProgress.deleteMany({ moduleId: module._id }),
  ]);
  res.status(204).send();
});

export const listAllModules = asyncHandler(async (_req: Request, res: Response) => {
  const modules = await LearningModule.find().sort({ order: 1 });
  const counted = await Promise.all(
    modules.map(async (m) => ({
      ...toClient(m as any),
      _count: {
        lessons: await Lesson.countDocuments({ moduleId: m._id }),
        quizzes: await Quiz.countDocuments({ moduleId: m._id }),
      },
    }))
  );
  res.json(counted);
});

// ---- Lessons ----
export const createLesson = asyncHandler(async (req: Request, res: Response) => {
  const lesson = await Lesson.create(req.body);
  res.status(201).json(toClient(lesson as any));
});

export const updateLesson = asyncHandler(async (req: Request, res: Response) => {
  const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!lesson) throw new AppError("Lesson not found.", 404);
  res.json(toClient(lesson as any));
});

export const deleteLesson = asyncHandler(async (req: Request, res: Response) => {
  const lesson = await Lesson.findByIdAndDelete(req.params.id);
  if (!lesson) throw new AppError("Lesson not found.", 404);
  res.status(204).send();
});

// ---- Quizzes ----
export const createQuiz = asyncHandler(async (req: Request, res: Response) => {
  const quiz = await Quiz.create(req.body);
  res.status(201).json(toClient(quiz as any));
});

export const updateQuiz = asyncHandler(async (req: Request, res: Response) => {
  const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!quiz) throw new AppError("Quiz not found.", 404);
  res.json(toClient(quiz as any));
});

export const deleteQuiz = asyncHandler(async (req: Request, res: Response) => {
  const quiz = await Quiz.findByIdAndDelete(req.params.id);
  if (!quiz) throw new AppError("Quiz not found.", 404);
  await Promise.all([
    Question.deleteMany({ quizId: quiz._id }),
    QuizAttempt.deleteMany({ quizId: quiz._id }),
  ]);
  res.status(204).send();
});

export const listAllQuizzes = asyncHandler(async (_req: Request, res: Response) => {
  const quizzes = await Quiz.find().populate("moduleId");
  const counted = await Promise.all(
    quizzes.map(async (q) => ({
      ...toClient(q as any),
      module: q.moduleId && typeof q.moduleId === "object" ? toClient(q.moduleId as any) : null,
      _count: {
        questions: await Question.countDocuments({ quizId: q._id }),
        attempts: await QuizAttempt.countDocuments({ quizId: q._id }),
      },
    }))
  );
  res.json(counted);
});

// ---- Questions ----
export const createQuestion = asyncHandler(async (req: Request, res: Response) => {
  const question = await Question.create(req.body);
  res.status(201).json(toClient(question as any));
});

export const updateQuestion = asyncHandler(async (req: Request, res: Response) => {
  const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!question) throw new AppError("Question not found.", 404);
  res.json(toClient(question as any));
});

export const deleteQuestion = asyncHandler(async (req: Request, res: Response) => {
  const question = await Question.findByIdAndDelete(req.params.id);
  if (!question) throw new AppError("Question not found.", 404);
  res.status(204).send();
});

// ---- Analytics ----
export const getAnalytics = asyncHandler(async (_req: Request, res: Response) => {
  const [totalStudents, activeStudents, moduleCount, quizAttemptCount, assessments, attempts] = await Promise.all([
    User.countDocuments({ role: "STUDENT" }),
    User.countDocuments({ role: "STUDENT", isActive: true }),
    LearningModule.countDocuments(),
    QuizAttempt.countDocuments(),
    AwarenessAssessment.find(),
    QuizAttempt.find({ completedAt: { $ne: null } }),
  ]);

  const preScores = assessments.filter((a) => a.type === "PRE_TEST").map((a) => a.scorePercent);
  const postScores = assessments.filter((a) => a.type === "POST_TEST").map((a) => a.scorePercent);
  const avg = (arr: number[]) => (arr.length ? Math.round(arr.reduce((s, n) => s + n, 0) / arr.length) : null);

  res.json({
    totalStudents,
    activeStudents,
    moduleCount,
    quizAttemptCount,
    averageQuizScore: avg(attempts.map((a) => a.score)),
    averagePreTestScore: avg(preScores),
    averagePostTestScore: avg(postScores),
    hasData: totalStudents > 0,
  });
});
