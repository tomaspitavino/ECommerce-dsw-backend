import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { Usuario } from "../usuario/usuario.entity.mysql.js";

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
        passwordHash: "usuario123",
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
        passwordHash: "gomuGomu123",
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
        passwordHash: "princeofall",
        rol: "cliente",
        fondos: 1800,
      },
    ];

    // 📦 Inserción masiva
    for (const data of usuariosData) {
      em.create(Usuario, data);
    }

    await em.flush();

    console.log("✅ Usuarios creados exitosamente.");
  }
}
