import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthPayload {
  id: number;
  rol: string;
}

// Extendemos Request para que TypeScript reconozca req.user
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Acceso denegado: Mala autenticación o falta de credenciales",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Sesión inválida o expirada" });
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.rol)) {
      return res
        .status(403)
        .json({ message: "Acceso denegado: Mala autorización" });
    }
    next();
  };
}

export function requireSelfOrAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    return res.status(401).json({ message: "No autenticado" });
  }

  const targetId = Number(req.params.id);
  const isSelf = req.user && req.user.id === targetId;
  const isAdmin = req.user && req.user.rol === "admin";

  if (isSelf || isAdmin) {
    return next();
  }

  res.status(403).json({ error: "Acceso denegado" });
}
