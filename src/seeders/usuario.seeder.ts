import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { Usuario } from "../usuario/usuario.entity.mysql.js";
import { UsuarioSchema } from "../shared/validation/zodSchemas.js";
import { ZodError } from "zod";

export class UsuarioSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const usuariosData = [
      {
        nombre: "Juan",
        apellido: "Pérez",
        direccion: "Calle Falsa 123",
        telefono: "1234567890",
        dni: "34567890",
        usuario: "juanperez",
        email: "juanp@mail.com",
        contrasenia: "usuario123",
        rol: "cliente",
        fondos: 5000,
      },
      {
        nombre: "Luffy",
        apellido: "Monkey D.",
        direccion: "East Blue 01",
        telefono: "1189001122",
        dni: "37112238",
        usuario: "luffy",
        email: "luffy@onepiece.jp",
        contrasenia: "gomuGomu123",
        rol: "cliente",
        fondos: 2100,
      },
      {
        nombre: "Vegeta",
        apellido: "Saiyan",
        direccion: "Calle Capsule 12",
        telefono: "1165432109",
        dni: "32148976",
        usuario: "vegeta_saiyan",
        email: "vegeta@capsulecorp.jp",
        contrasenia: "princeofall123",
        rol: "cliente",
        fondos: 1800,
      },
    ];

    // 📦 Inserción masiva con validación Zod
    for (const data of usuariosData) {
      try {
        const validatedData = UsuarioSchema.parse(data);
        em.create(Usuario, { ...validatedData, passwordHash: validatedData.contrasenia });
      } catch (error) {
        if (error instanceof ZodError) {
          console.error(`❌ Error validando usuario ${data.usuario}:`, error.issues);
          throw error;
        }
        throw error;
      }
    }

    await em.flush();

    console.log("✅ Usuarios creados exitosamente.");
  }
}
