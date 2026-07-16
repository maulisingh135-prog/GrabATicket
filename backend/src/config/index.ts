import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT ? Number(process.env.PORT) : 9000,
  mongoUrl: process.env.MONGO_CONNECTION_STRING || "mongodb://localhost:27017/grabaticket",
  jwtSecret: process.env.ACCESS_TOKEN_SECRET || process.env.HASH_SECRET || "grabaticket-dev-secret",
};
