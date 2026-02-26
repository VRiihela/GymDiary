import { Router } from "express";
import { register, login, refresh, logout } from "../controllers/auth.controller.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { validateBody } from "../middlewares/validate.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);

router.get("/me", requireAuth, (req, res) => {
  // req.user pitää olla middlewarelta (sub/email tms)
  // Esim:
  return res.json({
    id: req.user!.sub,
    email: req.user!.email, // jos mukana tokenissa
  });
});

router.post("/refresh", refresh);
router.post("/logout", logout)

export default router;