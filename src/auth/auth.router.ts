import { Router } from "express";
import {
  login,
  logout,
  refresh,
  sanitizeLoginInput,
} from "./auth.controller.js";

export const authRouter = Router();

authRouter.post("/login", sanitizeLoginInput, login);
authRouter.post("/refresh", refresh);
authRouter.post("/logout", logout);

