import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { Usuario } from "../usuario/usuario.entity.mysql.js";
import { UsuarioSchema } from "../shared/validation/zodSchemas.js";
import { ZodError } from "zod";
import bcrypt from "bcrypt";

export class UsuarioSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const usuariosData = [
      {
        nombre: "Administrador",
        apellido: "General",
        direccion: "Calle Central 100",
        telefono: "1122334455",
        dni: "273456789",
        usuario: "admin",
        email: "admin@muebleria.com",
        contrasenia: "admin1234a",
        rol: "admin",
        fondos: 100000,
      },
      {
        nombre: "Goku",
        apellido: "Son",
        direccion: "Monte Paoz 77",
        telefono: "1199988877",
        dni: "30125456",
        usuario: "gokuson",
        email: "goku@kamehouse.com",
        contrasenia: "kamehameha123a",
        rol: "cliente",
        fondos: 1500,
      },
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
        contrasenia: "conmiBulmaNO777",
        rol: "cliente",
        fondos: 1800,
      },
    ];

    //Inserción masiva con validación Zod y hash de contraseñas
    for (const data of usuariosData) {
      try {
        const validatedData = UsuarioSchema.parse(data);
        const { contrasenia, ...rest } = validatedData;
        const passwordHash = await bcrypt.hash(contrasenia, 10);
        em.create(Usuario, { ...rest, passwordHash });
      } catch (error) {
        if (error instanceof ZodError) {
          console.error(
            `❌ Error validando usuario ${data.usuario}:`,
            error.issues,
          );
          throw error;
        }
        throw error;
      }
    }

    await em.flush();

    console.log("✅ Usuarios creados exitosamente.");
  }
}
