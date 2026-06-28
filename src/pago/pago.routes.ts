import { Router } from "express";
import { crearPreferencia, webhook } from "./pago.controller.js";
import { verifyToken } from "../auth/auth.middleware.js";

export const pagoRouter = Router();

pagoRouter.get("/success", (req, res) => res.send("Exito"));
pagoRouter.post("/:pedidoId", verifyToken, crearPreferencia);
pagoRouter.post("/webhook", webhook); // público, lo llama MercadoPago
