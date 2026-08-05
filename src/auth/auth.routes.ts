import { Router } from "express";
import {
  login,
  logout,
  refresh,
  sanitizeLoginInput,
} from "./auth.controller.js";

export const authRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación y manejo de sesión
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginInput:
 *       type: object
 *       required: [email, contrasenia]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         contrasenia:
 *           type: string
 *           minLength: 8
 *           maxLength: 64
 *     LoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         token:
 *           type: string
 *         id:
 *           type: integer
 *         rol:
 *           type: string
 *           enum: [cliente, admin]
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve accessToken
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Email o contraseña incorrecta
 */

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Renovar el accessToken usando el refreshToken (cookie)
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       200:
 *         description: Nuevo accessToken generado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Refresh token inválido o expirado
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cerrar sesión (limpia la cookie del refreshToken)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Sesión cerrada
 */

authRouter.post("/login", sanitizeLoginInput, login);
authRouter.post("/refresh", refresh);
authRouter.post("/logout", logout);
