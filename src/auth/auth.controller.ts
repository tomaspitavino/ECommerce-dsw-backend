import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { orm } from "../shared/db/orm.js";
import { Usuario } from "../usuario/usuario.entity.mysql.js";
import { validate } from "../shared/validation/validateRequest.js";
import { LoginSchema } from "../shared/validation/zodSchemas.js";
export const sanitizeLoginInput = validate(LoginSchema);

const em = orm.em;

const REFRESH_COOKIE = "refreshToken";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // solo HTTPS en prod
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en ms
};

export async function login(req: Request, res: Response) {
  try {
    const { email, contrasenia } = req.body.validated;

    const usuario = await em.findOne(Usuario, { email });
    if (!usuario) {
      return res.status(401).json({ message: "Email o contraseña incorrecta" });
    }

    // recordar que en este punnto el cliente ya está creado
    const esCorrecta = await bcrypt.compare(contrasenia, usuario.passwordHash);
    if (!esCorrecta) {
      return res.status(401).json({ message: "Email o contraseña incorrecta" });
    }

    const accessToken = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN ?? "15m" } as jwt.SignOptions,
    );

    const refreshToken = jwt.sign(
      { id: usuario.id },
      process.env.JWT_REFRESH_SECRET!,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
      } as jwt.SignOptions,
    );

    res.cookie(REFRESH_COOKIE, refreshToken, COOKIE_OPTIONS);

    return res.status(200).json({
      message: "¡Inicio de sesión exitoso!",
      token: accessToken,
      id: usuario.id,
      rol: usuario.rol,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token requerido" });
      // Sin refresh token no podemos refrescar la sesión
    }

    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!,
    ) as { id: number };

    const usuario = await em.findOne(Usuario, { id: payload.id });
    if (!usuario) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    // refresca el accessToken
    const accessToken = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN ?? "15m" } as jwt.SignOptions,
    );

    return res.status(200).json({ token: accessToken });
  } catch {
    return res
      .status(401)
      .json({ message: "Refresh token inválido o expirado" });
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie(REFRESH_COOKIE, COOKIE_OPTIONS);
  return res.status(200).json({ message: "Sesión cerrada" });
}
