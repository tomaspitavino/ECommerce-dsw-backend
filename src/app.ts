import { RequestContext } from "@mikro-orm/core";
import cors from "cors";
import "dotenv/config";
import express from "express";
import "express-async-errors";
import "reflect-metadata";
import { categoriaRouter } from "./categoria/categoria.routes.js";
import { clienteRouter } from "./cliente/cliente.routes.js";
import { lineaPedidoRouter } from "./lineaPedido/lineaPedido.routes.js";
import { materialRouter } from "./material/material.routes.js";
import { muebleRouter } from "./mueble/mueble.routes.js";
import { orm, syncSchema } from "./shared/db/orm.js";
// import { AppError, errorHandler } from './shared/errors';

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : "*",
    credentials: true,
  }),
);

const port = 3000;

// Revisar paths
app.use("/api/clientes", clienteRouter);
app.use("/api/categorias", categoriaRouter);
app.use("/api/materiales", materialRouter);
app.use("/api/muebles", muebleRouter);
app.use("/api/lineas-pedido", lineaPedidoRouter);
// descuento tiene alcance de aprobación directa, lo sacamos para la regularidad.

/* // 404 para rutas no existentes
app.use('*', (_req, _res, next) =>
    next(new AppError('Recurso no encontrado', 404))
);

// Manejador de errores global (siempre al final)
app.use(errorHandler);
 */

await syncSchema(); // never in production

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`);
});
