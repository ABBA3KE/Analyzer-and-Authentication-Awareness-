export type Role = "STUDENT" | "ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  fullName?: string;
}

export interface StudentProfile {
  id: string;
  fullName: string;
  studentId?: string | null;
  department?: string | null;
  polytechnic?: string | null;
  level?: string | null;
  photoUrl?: string | null;
}

export interface LearningModuleSummary {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  durationMin: number;
  order: number;
  isPublished: boolean;
  objectives?: string[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  keyTakeaways: string[];
  order: number;
}

export interface QuizSummaryQuestion {
  id: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE";
  prompt: string;
  options: string[];
  topic: string;
  difficulty: string;
}

export interface QuizSummary {
  id: string;
  title: string;
  description?: string | null;
  questions: QuizSummaryQuestion[];
}

export interface QuizAttemptResult {
  id: string;
  score: number;
  totalQuestions: number;
  answers: {
    questionId: string;
    selectedIndex: number;
    isCorrect: boolean;
    question: { prompt: string; explanation: string; correctIndex: number; options: string[] };
  }[];
}

export interface ProgressSummary {
  modulesCompleted: number;
  modulesTotal: number;
  quizzesCompleted: number;
  quizAverage: number;
  preTestScore: number | null;
  postTestScore: number | null;
  moduleProgress: { moduleId: string; percentComplete: number; isCompleted: boolean; module: LearningModuleSummary }[];
  recentAttempts: { id: string; score: number; completedAt: string }[];
}
