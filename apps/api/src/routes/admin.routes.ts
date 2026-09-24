import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { validateBody } from "../validators/validate.js";
import { moduleSchema, lessonSchema, quizSchema, questionSchema } from "../validators/admin.validators.js";
import {
  listStudents, getStudentDetail, setStudentActive,
  createModule, updateModule, deleteModule, listAllModules,
  createLesson, updateLesson, deleteLesson,
  createQuiz, updateQuiz, deleteQuiz, listAllQuizzes,
  createQuestion, updateQuestion, deleteQuestion,
  getAnalytics,
} from "../controllers/admin.controller.js";

const router = Router();
router.use(requireAuth, requireAdmin);

router.get("/students", listStudents);
router.get("/students/:id", getStudentDetail);
router.patch("/students/:id/active", setStudentActive);

router.get("/modules", listAllModules);
router.post("/modules", validateBody(moduleSchema), createModule);
router.put("/modules/:id", validateBody(moduleSchema.partial()), updateModule);
router.delete("/modules/:id", deleteModule);

router.post("/lessons", validateBody(lessonSchema), createLesson);
router.put("/lessons/:id", validateBody(lessonSchema.partial()), updateLesson);
router.delete("/lessons/:id", deleteLesson);

router.get("/quizzes", listAllQuizzes);
router.post("/quizzes", validateBody(quizSchema), createQuiz);
router.put("/quizzes/:id", validateBody(quizSchema.partial()), updateQuiz);
router.delete("/quizzes/:id", deleteQuiz);

router.post("/questions", validateBody(questionSchema), createQuestion);
router.put("/questions/:id", validateBody(questionSchema.partial()), updateQuestion);
router.delete("/questions/:id", deleteQuestion);

router.get("/analytics", getAnalytics);

export default router;
