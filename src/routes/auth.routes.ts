import { Router } from "express";
import { register, login, refresh, logout } from "../controllers/auth.controller.js";
import { validateRegister, validateLogin } from "../middlewares/authValidation.js";

const router = Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/refresh", refresh);
router.post("/logout", logout)

export default router;