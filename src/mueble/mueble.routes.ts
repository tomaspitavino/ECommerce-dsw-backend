import { Router } from "express";
import {
  add,
  findAll,
  findOne,
  remove,
  update,
  sanitizeMuebleInput,
} from "./mueble.controller.js";

export const muebleRouter = Router();

muebleRouter.get("/", findAll);
muebleRouter.get("/:id", findOne);
muebleRouter.post("/", sanitizeMuebleInput, add);
muebleRouter.put("/:id", sanitizeMuebleInput, update);
muebleRouter.patch("/:id", sanitizeMuebleInput, update);
muebleRouter.delete("/:id", remove);
