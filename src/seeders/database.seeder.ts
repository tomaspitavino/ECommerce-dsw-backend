import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { CategoriaSeeder } from "./categoria.seeder.js";
import { UsuarioSeeder } from "./usuario.seeder.js";
import { DescuentoSeeder } from "./descuento.seeder.js";
import { MaterialSeeder } from "./material.seeder.js";
import { MuebleSeeder } from "./mueble.seeder.js";

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.log("🌱 Ejecutando DatabaseSeeder...");

    await new UsuarioSeeder().run(em);
    await new CategoriaSeeder().run(em);
    await new MaterialSeeder().run(em);
    await new MuebleSeeder().run(em);
    await new DescuentoSeeder().run(em);

    console.log("✅ Seed completo");
  }
}
