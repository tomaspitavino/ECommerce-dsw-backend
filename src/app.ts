import { RequestContext } from "@mikro-orm/core";
import cors from "cors";
import "dotenv/config";
import express from "express";
import "express-async-errors";
import "reflect-metadata";
import { categoriaRouter } from "./categoria/categoria.routes.js";
import { usuarioRouter } from "./usuario/usuario.routes.js";
import { descuentoRouter } from "./descuento/descuento.routes.js";
import { materialRouter } from "./material/material.routes.js";
import { muebleRouter } from "./mueble/mueble.routes.js";
import { pedidoRouter } from "./pedido/pedido.routes.js";
import { orm, syncSchema } from "./shared/db/orm.js";
import { authRouter } from "./auth/auth.router.js";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { logger } from "./shared/logger.js";
import { error } from "winston";

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});

const CORS_OPTIONS = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
};

app.use(cors(CORS_OPTIONS));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // max request por IP
  message: { message: "Demasiadas solicitudes, intenta más tarde" },
});

app.use(limiter);

app.use(cookieParser());

app.use(helmet());

const port = 3000;

// Revisar paths
app.use("/api/clientes", usuarioRouter);
app.use("/api/clientes/:id/favoritos", usuarioRouter); // para favoritos

app.use("/api/auth", authRouter); // login

app.use("/api/pedidos", pedidoRouter); // para pedidos
app.use("/api/categorias", categoriaRouter);
app.use("/api/materiales", materialRouter);
app.use("/api/muebles", muebleRouter);
app.use("/api/descuentos", descuentoRouter);

await syncSchema(); // never in production

app
  .listen(port, () => {
    logger.info(`Listening on http://localhost:${port}/`);
  })
  .on("error", (error) => {
    logger.error("Error al iniciar el servidor", error);
  });

