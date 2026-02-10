import type { Request, Response } from "express";
import { Types } from "mongoose";
import { Workout } from "../models/workoutModel.js";

export async function listWorkouts(req:Request, res: Response) {
    const userId = req.user?.sub;

    if(!userId) {
        return res.status(401).json({ error: "Unauthorised" });
    }

    const workouts = await Workout.find({ userId }).sort({ date: -1 }).limit(50);
    return res.json(workouts);
}

export async function createWorkout(req: Request, res: Response) {
  const userId = req.user?.sub;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const body = (req.body ?? {}) as { title?: string; date?: string; exercises?: unknown };
  const title = body.title?.trim();

  if (!title) return res.status(400).json({ error: "title required" });

  const workout = await Workout.create({
    userId,
    title,
    date: body.date ? new Date(body.date) : new Date(),
    exercises: Array.isArray(body.exercises) ? body.exercises : [],
  });

  return res.status(201).json(workout);
}

export async function getWorkoutById(req:Request <{ id: string }>, res: Response) {
    const userId = req.user?.sub;
    if (!userId)    {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;
    // Id format check
    if (!Types.ObjectId.isValid(id))    {
        return res.status(400).json({ error: "Invalid workout id" });
    }

    const workout = await Workout.findOne({ _id: id, userId});

    if (!workout)   {
        return res.status(404).json({ error: "No workout found" });
    }

    return res.json(workout);
}

export async function deleteWorkout(req: Request <{ id: string }>, res: Response) {
    const userId = req.user?.sub;
    if (!userId)    {
        return res.status(401).json({ error: "Unauthorized"});
    }

    const { id } = req.params;

    if (!Types.ObjectId.isValid(id))    {
        return res.status(400).json({ error: "Invalid workout id"})
    }

    const deleted = await Workout.findByIdAndDelete({ _id: id, userId});

    if (!deleted)   {
        return res.status(404).json({ error: "Workout not found" });
    }

    return res.status(204).send();
}

export async function updateWorkout(req: Request <{id: string}>, res: Response) {
  const userId = req.user?.sub;
  
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid workout id" });
  }

  const body = (req.body ?? {}) as {
    title?: string;
    date?: string;
    exercises?: unknown;
  };

  const update: Record<string, unknown> = {};

  if (typeof body.title === "string") {
    const title = body.title.trim();
    if (!title) return res.status(400).json({ error: "title cannot be empty" });
    update.title = title;
  }

  if (typeof body.date === "string") {
    const d = new Date(body.date);
    if (Number.isNaN(d.getTime())) {
      return res.status(400).json({ error: "Invalid date" });
    }
    update.date = d;
  }

  if (body.exercises !== undefined) {
    if (!Array.isArray(body.exercises)) {
      return res.status(400).json({ error: "exercises must be an array" });
    }
    update.exercises = body.exercises;
  }

  if (Object.keys(update).length === 0) {
    return res.status(400).json({ error: "No updatable fields provided" });
  }

  const updated = await Workout.findOneAndUpdate(
    { _id: id, userId },
    { $set: update },
    { new: true }
  );

  if (!updated) return res.status(404).json({ error: "Workout not found" });

  return res.json(updated);
}