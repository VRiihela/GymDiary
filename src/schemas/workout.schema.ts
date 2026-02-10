import { z } from "zod";

export const setSchema = z.object({
    reps: z.number().int().min(0),
    weight: z.number().min(0),
    rpe: z.number().min(0).max(10).optional(),
})
export const exerciseSchema = z.object({
    name: z.string().trim().min(1),
    sets: z.array(setSchema).default([])
})

export const workoutCreateSchema = z.object({
    title: z.string().trim().min(1, "title required"),
    // date: z.string().datetime().optional(),
    exercises: z.array(exerciseSchema).default([]),
})

export const workoutUpdateSchema = z.object({
    title: z.string().trim().min(1).optional(),
    // date: z.string().datetime().optional(),
    exercises: z.array(exerciseSchema).optional(),
})
.refine((obj)   => Object.keys(obj).length > 0, {
    message: "No updatable fields provided",
});

export type workoutCreateInput = z.infer<typeof workoutCreateSchema>;
export type workoutUpdateInput = z.infer<typeof workoutUpdateSchema>;