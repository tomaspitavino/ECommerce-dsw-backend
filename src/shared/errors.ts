import type { NextFunction, Request, Response } from "express";

export class AppError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode = 400, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  // AppError conocida
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details ?? null,
    });
  }

  // Otros errores (fallback 500)
  const isProd = process.env.NODE_ENV === "production";
  const message = err instanceof Error ? err.message : "Error inesperado";
  if (!isProd) console.error("[UnhandledError]", err);

  return res.status(500).json({
    error: "Error interno del servidor",
    details: isProd ? null : message,
  });
}
