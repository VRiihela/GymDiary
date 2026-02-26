import { z } from "zod";

const setSchema = z.object({
  weight: z.number().min(0, "weight must be >= 0"),
  reps: z.number().int().min(1, "reps must be >= 1"),
});

const exerciseSchema = z.object({
  name: z.string().trim().min(1, "exercise name required"),
  sets: z.array(setSchema).min(1, "at least one set required"),
});

export const createWorkoutSchema = z.object({
  title: z.string().trim().min(1, "title required"),
  date: z.string().datetime().optional(),
  exercises: z.array(exerciseSchema).min(1, "at least one exercise required"),
});

export type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>;