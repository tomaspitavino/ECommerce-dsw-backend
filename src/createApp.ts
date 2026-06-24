import { RequestContext } from "@mikro-orm/core";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { authRouter } from "./auth/auth.router.js";
import { categoriaRouter } from "./categoria/categoria.routes.js";
import { descuentoRouter } from "./descuento/descuento.routes.js";
import { materialRouter } from "./material/material.routes.js";
import { muebleRouter } from "./mueble/mueble.routes.js";
import { pedidoRouter } from "./pedido/pedido.routes.js";
import { orm } from "./shared/db/orm.js";
import { usuarioRouter } from "./usuario/usuario.routes.js";
import { MercadoPagoConfig, Preference } from "mercadopago";

export function createApp() {
  const app = express();
  app.use(express.json());

  const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
  });

  app.use((req, res, next) => {
    RequestContext.create(orm.em, next);
  });

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    }),
  );

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: { message: "Demasiadas solicitudes, intenta más tarde" },
    }),
  );

  app.use(cookieParser());
  app.use(helmet());

  app.use("/api/clientes", usuarioRouter);
  app.use("/api/clientes/:id/favoritos", usuarioRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/pedidos", pedidoRouter);
  app.use("/api/categorias", categoriaRouter);
  app.use("/api/materiales", materialRouter);
  app.use("/api/muebles", muebleRouter);
  app.use("/api/descuentos", descuentoRouter);

  return app;
}
