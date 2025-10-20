import { Router } from "express";
import {
  add,
  findAll,
  findOne,
  remove,
  sanitizeItemInput,
  sanitizeItemPatchInput,
  update,
} from "./item.controller.js";

export const itemRouter = Router();

itemRouter.get("/", findAll);
itemRouter.get("/:id", findOne);
itemRouter.post("/", sanitizeItemInput, add);
itemRouter.put("/:id", sanitizeItemInput, update);
itemRouter.patch("/:id", sanitizeItemPatchInput, update);
itemRouter.delete("/:id", remove);
