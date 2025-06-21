import { Router } from "express";
import {
  add,
  findAll,
  findOne,
  remove,
  update,
  sanitizeCharacterInput,
} from "./mueble.controller.js";

export const muebleRouter = Router();

muebleRouter.get("/", findAll);
muebleRouter.get("/:id", findOne);
muebleRouter.post("/", sanitizeCharacterInput, add);
muebleRouter.put("/:id", sanitizeCharacterInput, update);
muebleRouter.patch("/:id", sanitizeCharacterInput, update);
muebleRouter.delete("/:id", remove);
