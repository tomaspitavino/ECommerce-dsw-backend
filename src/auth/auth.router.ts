import { Router } from "express";
import { login, sanitizeLoginInput } from "./auth.controller.js";

export const authRouter = Router();

authRouter.post("/login", sanitizeLoginInput, login);
