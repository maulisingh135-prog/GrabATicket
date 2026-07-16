import mongoose from "mongoose";
import { config } from "./index";

// NOTE: the live API (see src/app.ts) reads and writes backend/data/db.json —
// it does not use MongoDB/Mongoose for anything. This connection is kept
// around for any future migration to Mongo, but it must never block or
// crash server startup, since MongoDB usually isn't running in this project.
export const connectDb = async () => {
  try {
    await mongoose.connect(config.mongoUrl, {
      dbName: "grabaticket",
      serverSelectionTimeoutMS: 2000,
    });
    console.log("MongoDB connected:", config.mongoUrl);
  } catch (error) {
    console.warn(
      "MongoDB not connected (this is fine — the API runs on backend/data/db.json). Reason:",
      error instanceof Error ? error.message : error
    );
  }
};
