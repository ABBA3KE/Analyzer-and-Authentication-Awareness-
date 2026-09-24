import { Router } from "express";
import { register, login, logout, me } from "../controllers/auth.controller.js";
import { validateBody } from "../validators/validate.js";
import { registerSchema, loginSchema } from "../validators/auth.validators.js";
import { requireAuth } from "../middleware/auth.js";
import { authRateLimiter } from "../middleware/rateLimit.js";

const router = Router();

router.post("/register", authRateLimiter, validateBody(registerSchema), register);
router.post("/login", authRateLimiter, validateBody(loginSchema), login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);

export default router;
