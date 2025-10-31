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
          "https://plus.unsplash.com/premium_photo-1681245768600-d84542af04a7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1374",
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
          "https://images.unsplash.com/photo-1729603369774-23019dbf6c9c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=869",
          "https://images.unsplash.com/photo-1665005255783-3298cabef5aa?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=464",
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
          "https://plus.unsplash.com/premium_photo-1734029815108-169d085ca9aa?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=387",
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
          "https://plus.unsplash.com/premium_photo-1681487121780-8ce9769b4896?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870",
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
          "https://plus.unsplash.com/premium_photo-1681449856301-2446332b2ce4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870",
          "https://images.unsplash.com/photo-1742569272187-1a5f769d79cf?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=400",
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
          "https://images.unsplash.com/photo-1640169124017-ac05b8fc399f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=348",
        ],
      },
    ];

    muebles.forEach((m) => em.create(Mueble, m));
    await em.flush();
    console.log("✅ Muebles creados.");
  }
}
