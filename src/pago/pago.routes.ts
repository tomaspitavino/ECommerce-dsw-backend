import { Router } from "express";
import { crearPreferencia, webhook } from "./pago.controller.js";
import { verifyToken } from "../auth/auth.middleware.js";

export const pagoRouter = Router();

pagoRouter.get("/success", (req, res) => {
  res.redirect(
    `${process.env.FRONTEND_URL || "http://localhost:5173"}/pedidos`,
  );
});
pagoRouter.post("/webhook", webhook); // público, lo llama MercadoPago
pagoRouter.post("/:pedidoId", verifyToken, crearPreferencia);
