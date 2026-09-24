import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../validators/validate.js";
import {
  updateProfileSchema, moduleProgressSchema, quizAttemptSchema, assessmentSchema,
} from "../validators/student.validators.js";
import {
  getProfile, updateProfile, listModules, getModule, updateModuleProgress,
  getQuiz, submitQuizAttempt, submitAssessment, getProgressSummary,
} from "../controllers/student.controller.js";

const router = Router();
router.use(requireAuth);

router.get("/profile", getProfile);
router.put("/profile", validateBody(updateProfileSchema), updateProfile);

router.get("/modules", listModules);
router.get("/modules/:id", getModule);
router.post("/modules/:id/progress", validateBody(moduleProgressSchema), updateModuleProgress);

router.get("/quizzes/:id", getQuiz);
router.post("/quizzes/:id/attempt", validateBody(quizAttemptSchema), submitQuizAttempt);

router.post("/assessments", validateBody(assessmentSchema), submitAssessment);
router.get("/progress", getProgressSummary);

export default router;
