import { describe, it, expect, vi, beforeEach } from "vitest";
import jwt from "jsonwebtoken";
import { requireRole, verifyToken } from "./auth.middleware.js";
import type { Request, Response, NextFunction } from "express";

describe("requireRole", () => {
  it("debería devolver 403 si el rol no coincide", () => {
    const req = { user: { id: 1, rol: "cliente" } } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    requireRole("admin")(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("debería llamar a next() si el rol coincide", () => {
    const req = { user: { id: 1, rol: "admin" } } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    requireRole("admin")(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});

describe("verifyToken", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "test-jwt-secret";
  });

  it("debería devolver 401 si falta el header Authorization", () => {
    const req = { headers: {} } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("debería llamar a next() y asignar req.user con un token válido", () => {
    const token = jwt.sign({ id: 1, rol: "cliente" }, process.env.JWT_SECRET!);
    const req = {
      headers: { authorization: `Bearer ${token}` },
    } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    verifyToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toMatchObject({ id: 1, rol: "cliente" });
  });
});
