import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { createWorkout, getWorkoutById, deleteWorkout, listWorkouts } from "../controllers/workout.controller.js";

const router = Router();

// All endpoints requires login
router.use(requireAuth);

router.get("/", listWorkouts);
router.post("/", createWorkout);
router.get("/:id", getWorkoutById);
router.delete("/:id", deleteWorkout);

export default router;