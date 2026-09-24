import mongoose from "mongoose";
import { env } from "./env.js";

// Single shared Mongoose connection for the app.
export async function connectDB(): Promise<void> {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongodbUri);
  // eslint-disable-next-line no-console
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}
