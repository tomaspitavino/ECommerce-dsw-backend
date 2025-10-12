import { Request, Response, NextFunction } from "express";
import { NotFoundError, ValidationError } from "@mikro-orm/core";
import { ZodError } from "zod";
import { HttpError } from "../errors/ErrorClass.js";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(`[ERROR] ${req.method} ${req.path}`, err);

  // 1️⃣ Errores de validación Zod
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Error de validación",
      issues: err.issues.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
  }

  // 2️⃣ Entidad no encontrada (MikroORM)
  if (err instanceof NotFoundError) {
    return res.status(404).json({ message: "Entidad no encontrada" });
  }

  // 3️⃣ Error de validación de MikroORM
  if (err instanceof ValidationError) {
    return res.status(400).json({ message: err.message });
  }

  // 4️⃣ Duplicado (MySQL o SQLite)
  if (err.code === "ER_DUP_ENTRY" || err.code === "SQLITE_CONSTRAINT_UNIQUE") {
    return res.status(409).json({ message: "Registro duplicado" });
  }

  // 5️⃣ Errores personalizados (HttpError)
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }

  // 6️⃣ Default — error inesperado
  return res.status(500).json({
    message: "Error interno del servidor",
    details: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
}
