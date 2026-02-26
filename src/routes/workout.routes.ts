import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { createWorkout, getWorkoutById, deleteWorkout, listWorkouts, updateWorkout } from "../controllers/workout.controller.js";
import { validateBody, validateParams } from "../middlewares/validate.js";
import { workoutCreateSchema, workoutIdParamsSchema, workoutUpdateSchema, type workoutCreateInput, type workoutUpdateInput } from "../schemas/workout.schema.js";

const router = Router();

// All endpoints requires login
router.use(requireAuth);

router.get("/", listWorkouts);
router.post("/", validateBody<workoutCreateInput>(workoutCreateSchema), createWorkout);

router.get("/:id", validateParams(workoutIdParamsSchema), getWorkoutById);
router.delete("/:id", validateParams(workoutIdParamsSchema), deleteWorkout);
router.put("/:id", validateParams(workoutIdParamsSchema), validateBody<workoutUpdateInput>(workoutUpdateSchema), updateWorkout)

export default router;
