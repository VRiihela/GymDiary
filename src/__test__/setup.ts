import mongoose from "mongoose";

export async function connectTestDB() {
    const uri = process.env.MONGODB_URI_TEST;
    if (!uri) throw new Error("MONGODB_URI_TEST missing");
    await mongoose.connect(uri);
}

export async function clearTestDB() {
    const db = mongoose.connection.db;
    if(!db) {
        throw new Error("Database not connected");
    }

    const collections = await db.collections();
    for (const c of collections) {
        await c.deleteMany({});
    }
}

export async function disconnectTestDB() {
    await mongoose.disconnect();
}