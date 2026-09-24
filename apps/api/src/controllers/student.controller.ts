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

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.sub);
  if (!user?.profile) throw new AppError("Profile not found.", 404);
  res.json({ id: user.id, ...user.profile.toObject() });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(
    req.user!.sub,
    { $set: Object.fromEntries(Object.entries(req.body).map(([k, v]) => [`profile.${k}`, v])) },
    { new: true }
  );
  if (!user?.profile) throw new AppError("Profile not found.", 404);
  res.json({ id: user.id, ...user.profile.toObject() });
});

export const listModules = asyncHandler(async (_req: Request, res: Response) => {
  const modules = await LearningModule.find({ isPublished: true }).sort({ order: 1 });
  res.json(toClientList(modules as any));
});

export const getModule = asyncHandler(async (req: Request, res: Response) => {
  const module = await LearningModule.findOne({ _id: req.params.id, isPublished: true });
  if (!module) throw new AppError("Module not found.", 404);

  const [lessons, quizzes] = await Promise.all([
    Lesson.find({ moduleId: module._id }).sort({ order: 1 }),
    Quiz.find({ moduleId: module._id, isPublished: true }),
  ]);

  res.json({
    ...toClient(module as any),
    lessons: toClientList(lessons as any),
    quizzes: toClientList(quizzes as any),
  });
});

export const updateModuleProgress = asyncHandler(async (req: Request, res: Response) => {
  const percentComplete: number = req.body.percentComplete;
  const progress = await ModuleProgress.findOneAndUpdate(
    { userId: req.user!.sub, moduleId: req.params.id },
    {
      $set: {
        percentComplete,
        isCompleted: percentComplete >= 100,
        lastAccessed: new Date(),
      },
    },
    { new: true, upsert: true }
  );
  res.json(toClient(progress as any));
});

export const getQuiz = asyncHandler(async (req: Request, res: Response) => {
  const quiz = await Quiz.findOne({ _id: req.params.id, isPublished: true });
  if (!quiz) throw new AppError("Quiz not found.", 404);

  // Correct answer and explanation are withheld until submission.
  const questions = await Question.find({ quizId: quiz._id })
    .select("_id type prompt options topic difficulty order")
    .sort({ order: 1 });

  res.json({
    ...toClient(quiz as any),
    questions: toClientList(questions as any),
  });
});

export const submitQuizAttempt = asyncHandler(async (req: Request, res: Response) => {
  const quizId = req.params.id;
  const questions = await Question.find({ quizId });
  if (questions.length === 0) throw new AppError("Quiz not found.", 404);

  const byId = new Map(questions.map((q) => [q.id, q]));
  let correctCount = 0;

  const answerRows = (req.body.answers as { questionId: string; selectedIndex: number }[]).map((a) => {
    const q = byId.get(a.questionId);
    if (!q) throw new AppError("Invalid question in submission.", 422);
    const isCorrect = q.correctIndex === a.selectedIndex;
    if (isCorrect) correctCount += 1;
    return {
      questionId: q._id,
      selectedIndex: a.selectedIndex,
      isCorrect,
      question: {
        prompt: q.prompt,
        explanation: q.explanation,
        correctIndex: q.correctIndex,
        options: q.options,
      },
    };
  });

  const attempt = await QuizAttempt.create({
    userId: req.user!.sub,
    quizId,
    score: Math.round((correctCount / questions.length) * 100),
    totalQuestions: questions.length,
    completedAt: new Date(),
    answers: answerRows,
  });

  const plain = toClient(attempt as any)!;
  res.status(201).json({
    ...plain,
    answers: plain.answers.map((a: any) => ({ ...a, questionId: String(a.questionId) })),
  });
});

export const submitAssessment = asyncHandler(async (req: Request, res: Response) => {
  const { type, responses } = req.body as { type: "PRE_TEST" | "POST_TEST"; responses: { topic: string; isCorrect: boolean }[] };
  const correct = responses.filter((r) => r.isCorrect).length;
  const scorePercent = Math.round((correct / responses.length) * 100);

  const assessment = await AwarenessAssessment.create({
    userId: req.user!.sub,
    type,
    scorePercent,
    responses,
  });
  res.status(201).json(toClient(assessment as any));
});

export const getProgressSummary = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.sub;
  const [moduleProgress, attempts, assessments] = await Promise.all([
    ModuleProgress.find({ userId }).populate("moduleId"),
    QuizAttempt.find({ userId, completedAt: { $ne: null } }).sort({ completedAt: -1 }),
    AwarenessAssessment.find({ userId }).sort({ takenAt: -1 }),
  ]);

  const quizAverage = attempts.length
    ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
    : 0;

  const preTest = assessments.find((a) => a.type === "PRE_TEST");
  const postTest = assessments.find((a) => a.type === "POST_TEST");

  res.json({
    modulesCompleted: moduleProgress.filter((m) => m.isCompleted).length,
    modulesTotal: moduleProgress.length,
    quizzesCompleted: attempts.length,
    quizAverage,
    moduleProgress: moduleProgress.map((mp) => ({
      moduleId: String((mp.moduleId as any)?._id ?? mp.moduleId),
      percentComplete: mp.percentComplete,
      isCompleted: mp.isCompleted,
      module: mp.moduleId && typeof mp.moduleId === "object" ? toClient(mp.moduleId as any) : null,
    })),
    recentAttempts: attempts.slice(0, 5).map((a) => ({ id: a.id, score: a.score, completedAt: a.completedAt })),
    preTestScore: preTest?.scorePercent ?? null,
    postTestScore: postTest?.scorePercent ?? null,
  });
});
