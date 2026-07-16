import app from "./app";
import { connectDb } from "./config/mongodb";
import { config } from "./config";

const startServer = async () => {
  await connectDb();

  app.listen(config.port, () => {
    console.log(`Listening on port: ${config.port}`);
  });
};

startServer();