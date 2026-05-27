import { Router } from "express";
import {
  add,
  findAll,
  findOne,
  remove,
  sanitizeMuebleInput,
  update,
} from "./mueble.controller.js";
import { requireRole, verifyToken } from "../auth/auth.middleware.js";

export const muebleRouter = Router();

// Públicas
muebleRouter.get("/", findAll);
muebleRouter.get("/:id", findOne);

// Admin
muebleRouter.post(
  "/",
  verifyToken,
  requireRole("admin"),
  sanitizeMuebleInput,
  add,
);
muebleRouter.put(
  "/:id",
  verifyToken,
  requireRole("admin"),
  sanitizeMuebleInput,
  update,
);
muebleRouter.patch(
  "/:id",
  verifyToken,
  requireRole("admin"),
  sanitizeMuebleInput,
  update,
);
muebleRouter.delete("/:id", verifyToken, requireRole("admin"), remove);
