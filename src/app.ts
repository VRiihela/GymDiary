import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import healthRouter from "./routes/healt.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js"

export const app = express();

app.use(helmet());
app.use(cors( { origin: true, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/healt", healthRouter);

app.use(notFound)
app.use(errorHandler)
