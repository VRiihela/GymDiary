import { Schema, model, Types } from "mongoose";

const setSchema = new Schema({
    weight: { type: Number, required: true, min: 0 },
    reps: { type: Number, required: true, min: 0 },
    rpe: { type: Number, required: false, min: 0, max: 10},
},
{ _id: false }
);

const exerciseSchema = new Schema({
    name: { type: String, required: true, trim: true },
    sets: { type: [setSchema], required: true, default: []},
},
{_id: false}
);

const workoutSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: Date, required: true, default: () => new Date() },
    title: { type: String, required: true, trim: true, default: [] },
    exercises: { type: [exerciseSchema], required: true, default: [] },
},
{ timestamps: true })

export const Workout = model("Workout", workoutSchema)