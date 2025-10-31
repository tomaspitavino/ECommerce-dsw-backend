import { RequestContext } from "@mikro-orm/core";
import cors from "cors";
import "dotenv/config";
import express from "express";
import "express-async-errors";
import "reflect-metadata";
import { categoriaRouter } from "./categoria/categoria.routes.js";
import { clienteRouter } from "./cliente/cliente.routes.js";
import { descuentoRouter } from "./descuento/descuento.routes.js";
import { materialRouter } from "./material/material.routes.js";
import { muebleRouter } from "./mueble/mueble.routes.js";
import { pedidoRouter } from "./pedido/pedido.routes.js";
import { orm, syncSchema } from "./shared/db/orm.js";

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

const port = 3000;

// Revisar paths
app.use("/api/clientes", clienteRouter);
app.use("/api/clientes/:id/favoritos", clienteRouter); // para favoritos

app.use("api/pedidos", pedidoRouter); // para pedidos
app.use("/api/categorias", categoriaRouter);
app.use("/api/materiales", materialRouter);
app.use("/api/muebles", muebleRouter);
app.use("/api/descuentos", descuentoRouter);

await syncSchema(); // never in production

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`);
});
