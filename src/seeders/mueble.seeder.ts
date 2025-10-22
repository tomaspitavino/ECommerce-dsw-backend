import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { Categoria } from "../categoria/categoria.entity.mysql.js";
import { Material } from "../material/material.entity.mysql.js";
import { Mueble } from "../mueble/mueble.entity.mysql.js";

export class MuebleSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const categorias = await em.find(Categoria, {});
    const materiales = await em.find(Material, {});

    const muebles = [
      {
        descripcion: "Cama de roble con cabecera",
        stock: 5,
        etiqueta: "Camas",
        precioUnitario: 75000,
        categoria:
          categorias.find((c) => c.nombre.includes("Camas")) || categorias[3],
        material:
          materiales.find((m) => m.nombre.includes("Madera")) || materiales[0],
        imagenes: [
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
        ],
      },
      {
        descripcion: "Mesa de noche minimalista",
        stock: 8,
        etiqueta: "Mesas",
        precioUnitario: 25000,
        categoria:
          categorias.find((c) => c.nombre.includes("Mesas")) || categorias[1],
        material:
          materiales.find((m) => m.nombre.includes("Madera")) || materiales[0],
        imagenes: [
          "https://images.unsplash.com/photo-1626425262231-9419b7abcc98?w=800",
        ],
      },
      {
        descripcion: "Mesa de comedor de roble macizo para 6 personas.",
        etiqueta: "Comedor",
        stock: 8,
        precioUnitario: 95000,
        categoria:
          categorias.find((c) => c.nombre.includes("Comedor")) || categorias[0],
        material:
          materiales.find((m) => m.nombre.includes("Madera")) || materiales[0],
        imagenes: [
          "https://images.unsplash.com/photo-1588854337115-1c9a9f5e91e4?w=800",
        ],
      },
      {
        descripcion: "Silla ergonómica tapizada con soporte lumbar ajustable.",
        etiqueta: "Oficina",
        stock: 20,
        precioUnitario: 42000,
        categoria:
          categorias.find((c) => c.nombre.includes("Oficina")) || categorias[0],
        material:
          materiales.find((m) => m.nombre.includes("Plástico")) ||
          materiales[1],
        imagenes: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
        ],
      },
      {
        descripcion: "Biblioteca modular adaptable a distintos espacios.",
        etiqueta: "Almacenamiento",
        stock: 5,
        precioUnitario: 74000,
        categoria:
          categorias.find((c) => c.nombre.includes("Dormitorio")) ||
          categorias[0],
        material:
          materiales.find((m) => m.nombre.includes("Madera")) || materiales[0],
        imagenes: [
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
        ],
      },
      {
        descripcion:
          "Sillón reclinable de cuero sintético con apoyapiés extensible.",
        etiqueta: "Living",
        stock: 4,
        precioUnitario: 123000,
        categoria:
          categorias.find((c) => c.nombre.includes("Living")) || categorias[0],
        material:
          materiales.find((m) => m.nombre.includes("Cuero")) || materiales[0],
        imagenes: [
          "https://images.unsplash.com/photo-1578894381163-e72c17f2e295?w=800",
        ],
      },
      {
        descripcion: "Lámpara de pie con base metálica y pantalla de tela.",
        etiqueta: "Iluminación",
        stock: 10,
        precioUnitario: 27000,
        categoria:
          categorias.find((c) => c.nombre.includes("Decoración")) ||
          categorias[0],
        material:
          materiales.find((m) => m.nombre.includes("Metal")) || materiales[0],
        imagenes: [
          "https://images.unsplash.com/photo-1616628182506-8a9621a5d3b0?w=800",
        ],
      },
    ];

    muebles.forEach((m) => em.create(Mueble, m));
    await em.flush();
    console.log("✅ Muebles creados.");
  }
}
