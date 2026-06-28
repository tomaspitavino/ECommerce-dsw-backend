import { Request, Response } from "express";
import { Usuario } from "../usuario/usuario.entity.mysql.js";
import { Mueble } from "../mueble/mueble.entity.mysql.js";
import { orm } from "../shared/db/orm.js";
import { Favorito } from "./favoritos.entity.mysql.js";
import { validate } from "../shared/validation/validateRequest.js";
import { FavoritoSchema } from "../shared/validation/zodSchemas.js";

const em = orm.em;

export const sanitizeFavoritoInput = validate(FavoritoSchema);

export async function addFavorito(req: Request, res: Response) {
  try {
    const usuarioId = req.user!.id;
    const muebleId = Number.parseInt(req.body.validated.muebleId);

    const favorito = em.create(Favorito, {
      usuario: em.getReference(Usuario, usuarioId),
      mueble: em.getReference(Mueble, muebleId),
    });

    await em.flush();
    res.status(201).json({ message: "Favorito agregado", data: favorito });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error al agregar favorito", error: error.message });
  }
}

export async function findAllFavoritos(req: Request, res: Response) {
  try {
    const idUsuario = Number.parseInt(req.params.id);
    const usuario = await em.findOneOrFail(Usuario, { id: idUsuario });
    const favoritos = await em.find(
      Favorito,
      { usuario: usuario },
      { populate: ["mueble"] },
    );
    res.status(200).json({ message: "Lista de favoritos", data: favoritos });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error al listar favoritos", error: error.message });
  }
}

export async function removeFavorito(req: Request, res: Response) {
  try {
    const usuarioId = Number.parseInt(req.params.id);
    const muebleId = Number.parseInt(req.params.muebleId);

    const favorito = await em.findOneOrFail(Favorito, {
      usuario: usuarioId,
      mueble: muebleId,
    });

    await em.removeAndFlush(favorito);
    res.status(200).json({ message: "Favorito eliminado" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error al eliminar favorito", error: error.message });
  }
}
