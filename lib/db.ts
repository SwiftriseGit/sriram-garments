import mongoose from "mongoose";


interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const cached: MongooseCache = (globalThis as any).__mongoose ?? {
  conn: null,
  promise: null,
};
(globalThis as any).__mongoose = cached;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Missing MONGODB_URI environment variable! Please configure MONGODB_URI in Vercel Project Settings -> Environment Variables."
      );
    }
  }

  const connectionUri = uri || "mongodb://localhost:27017/sriram_garments";

  if (!cached.promise) {
    cached.promise = mongoose.connect(connectionUri, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
