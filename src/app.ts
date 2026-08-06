import "dotenv/config";
import "express-async-errors";
import "reflect-metadata";
import { createApp } from "./createApp.js";
import { syncSchema, updateSchema } from "./shared/db/orm.js";
import { logger } from "./shared/logger.js";

const app = createApp();
const port = process.env.PORT || 3000;

if (process.env.NODE_ENV === "production") {
  await updateSchema(); // nunca borra datos
} else {
  await syncSchema(); // solo en desarrollo
}

app
  .listen(port, () => {
    logger.info(`Listening on http://localhost:${port}/`);
  })
  .on("error", (error) => {
    logger.error("Error al iniciar el servidor", error);
  });
