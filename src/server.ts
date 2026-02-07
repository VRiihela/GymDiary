import dotenv from "dotenv";
dotenv.config();

import { app } from "./app.js";
import { connectDB } from "./db.js";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000
const MONGODB_URI = process.env.MONGODB_URI;

async function start() {
    if (!MONGODB_URI) throw new Error("MONGODB_URI missing from .env");

    await connectDB(MONGODB_URI);

    app.listen(PORT, () => {
        console.log(`Server is up and running on port ${PORT}`)
    });
}

start().catch((err) =>  {
    console.error("Failed to start server:", err);
    process.exit(1);
})