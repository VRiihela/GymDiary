import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { createWorkout, getWorkoutById, deleteWorkout, listWorkouts, updateWorkout } from "../controllers/workout.controller.js";
import { validateBody } from "../middlewares/validate.js";
import { workoutCreateSchema, workoutUpdateSchema, type workoutCreateInput, type workoutUpdateInput } from "../schemas/workout.schema.js";

const router = Router();

// All endpoints requires login
router.use(requireAuth);

router.get("/", listWorkouts);
router.post("/", validateBody<workoutCreateInput>(workoutCreateSchema), createWorkout);

router.get("/:id", getWorkoutById);
router.delete("/:id", deleteWorkout);
router.put("/:id", validateBody<workoutUpdateInput>(workoutUpdateSchema), updateWorkout)

export default router;