import express, { urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js"
import healthRouter from "./routes/healt.js";
import workoutRouter from "./routes/workout.routes.js"
import { notFound, errorHandler } from "./middlewares/errorHandler.js";
import mongoSanitize from "express-mongo-sanitize";


export const app = express();

app.use(helmet());
app.use(cors( { origin: true, credentials: true }));
app.use(express.json());
app.use(urlencoded({ extended: false }))
app.use(morgan("dev"));
app.use(cookieParser());

app.use((req, _res, next)   => {
    Object.defineProperty(req, "query", {
        value: { ...(req as any).query },
        writable: true,
        configurable: true,
        enumerable: true,
    });
    next()
})
app.use(mongoSanitize());

app.use("/api/healt", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/workouts", workoutRouter);

app.use(notFound)
app.use(errorHandler)
