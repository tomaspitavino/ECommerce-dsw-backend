import { describe, it, expect, vi } from "vitest";
import { requireRole } from "./auth.middleware.js";
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
