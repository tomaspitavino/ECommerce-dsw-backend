import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { Material } from "../material/material.entity.mysql.js";
import { MaterialSchema } from "../shared/validation/zodSchemas.js";
import { ZodError } from "zod";

export class MaterialSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const materiales = [
      { nroMaterial: "M001", nombre: "Madera maciza" },
      { nroMaterial: "M002", nombre: "Metal cromado" },
      { nroMaterial: "M003", nombre: "Vidrio templado" },
      { nroMaterial: "M004", nombre: "Ratán sintético" },
      { nroMaterial: "M005", nombre: "MDF lacado" },
      { nroMaterial: "M006", nombre: "Acero inoxidable" },
      { nroMaterial: "M007", nombre: "Tela tapizada" },
    ];

    for (const m of materiales) {
      try {
        const existe = await em.findOne(Material, {
          nroMaterial: m.nroMaterial,
        });

        if (!existe) {
          const validatedData = MaterialSchema.parse(m);
          em.create(Material, validatedData);
        }
      } catch (error) {
        if (error instanceof ZodError) {
          console.error(
            `Error validando material ${m.nroMaterial}:`,
            error.issues,
          );
          throw error;
        }
        throw error;
      }
    }
    await em.flush();
    console.log("Materiales creados.");
  }
}
