import "dotenv/config";
import "express-async-errors";
import "reflect-metadata";
import { createApp } from "./createApp.js";
import { syncSchema } from "./shared/db/orm.js";
import { logger } from "./shared/logger.js";

const app = createApp();
const port = 3000;

await syncSchema(); // never in production

app
  .listen(port, () => {
    logger.info(`Listening on http://localhost:${port}/`);
  })
  .on("error", (error) => {
    logger.error("Error al iniciar el servidor", error);
  });

