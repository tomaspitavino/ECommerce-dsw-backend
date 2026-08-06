import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { Categoria } from "../categoria/categoria.entity.mysql.js";
import { Material } from "../material/material.entity.mysql.js";
import { Mueble } from "../mueble/mueble.entity.mysql.js";
import { MuebleSchema } from "../shared/validation/zodSchemas.js";
import { ZodError } from "zod";

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
        descripcion: "Mesa de comedor de roble macizo para 6 personas",
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
        descripcion: "Silla ergonómica tapizada con soporte lumbar ajustable",
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
        descripcion: "Biblioteca modular adaptable a distintos espacios",
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
          "Sillón reclinable de cuero sintético con apoyapiés extensible",
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
        descripcion: "Lámpara de pie con base metálica y pantalla de tela",
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
      {
        descripcion: "Mesa de jardín redonda resistente a la intemperie",
        stock: 6,
        etiqueta: "Exterior",
        precioUnitario: 58000,
        categoria:
          categorias.find((c) => c.nombre.includes("Exterior")) ||
          categorias[0],
        material:
          materiales.find((m) => m.nombre.includes("Ratán")) || materiales[0],
        imagenes: [
          "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800",
        ],
      },
      {
        descripcion: "Silla plegable de acero inoxidable para exterior",
        stock: 12,
        etiqueta: "Exterior",
        precioUnitario: 22000,
        categoria:
          categorias.find((c) => c.nombre.includes("Exterior")) ||
          categorias[0],
        material:
          materiales.find((m) => m.nombre.includes("Acero")) || materiales[0],
        imagenes: [
          "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800",
        ],
      },
      {
        descripcion: "Escritorio infantil con cajones y superficie amplia",
        stock: 7,
        etiqueta: "Infantil",
        precioUnitario: 35000,
        categoria:
          categorias.find((c) => c.nombre.includes("Infantil")) ||
          categorias[0],
        material:
          materiales.find((m) => m.nombre.includes("MDF")) || materiales[0],
        imagenes: [
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
        ],
      },
      {
        descripcion:
          "Cama infantil con barandas de seguridad y cajón integrado",
        stock: 4,
        etiqueta: "Infantil",
        precioUnitario: 68000,
        categoria:
          categorias.find((c) => c.nombre.includes("Infantil")) ||
          categorias[0],
        material:
          materiales.find((m) => m.nombre.includes("Madera")) || materiales[0],
        imagenes: [
          "https://images.unsplash.com/photo-1612965607446-25e1ef880045?w=800",
        ],
      },
      {
        descripcion:
          "Sofá de tres cuerpos tapizado en tela gris antideslizante",
        stock: 3,
        etiqueta: "Living",
        precioUnitario: 185000,
        categoria:
          categorias.find((c) => c.nombre.includes("Sofás")) || categorias[0],
        material:
          materiales.find((m) => m.nombre.includes("Tela")) || materiales[0],
        imagenes: [
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
        ],
      },
      {
        descripcion: "Estantería flotante de MDF lacado blanco para living",
        stock: 15,
        etiqueta: "Almacenamiento",
        precioUnitario: 18000,
        categoria:
          categorias.find((c) => c.nombre.includes("Almacenamiento")) ||
          categorias[0],
        material:
          materiales.find((m) => m.nombre.includes("MDF")) || materiales[0],
        imagenes: [
          "https://images.unsplash.com/photo-1526040652367-ac003a0475fe?w=800",
        ],
      },
      {
        descripcion: "Mesa de vidrio templado con base de acero inoxidable",
        stock: 5,
        etiqueta: "Mesas",
        precioUnitario: 112000,
        categoria:
          categorias.find((c) => c.nombre.includes("Mesas")) || categorias[0],
        material:
          materiales.find((m) => m.nombre.includes("Vidrio")) || materiales[0],
        imagenes: [
          "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=800",
        ],
      },
      {
        descripcion:
          "Silla de comedor tapizada en tela con patas de metal cromado",
        stock: 16,
        etiqueta: "Sillas",
        precioUnitario: 31000,
        categoria:
          categorias.find((c) => c.nombre.includes("Sillas")) || categorias[0],
        material:
          materiales.find((m) => m.nombre.includes("Tela")) || materiales[0],
        imagenes: [
          "https://images.unsplash.com/photo-1503602642458-232111445657?w=800",
        ],
      },
      {
        descripcion: "Hamaca de ratán sintético para jardín o terraza",
        stock: 3,
        etiqueta: "Exterior",
        precioUnitario: 47000,
        categoria:
          categorias.find((c) => c.nombre.includes("Exterior")) ||
          categorias[0],
        material:
          materiales.find((m) => m.nombre.includes("Ratán")) || materiales[0],
        imagenes: [
          "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800",
        ],
      },
      {
        descripcion: "Armario infantil de dos puertas con estantes internos",
        stock: 5,
        etiqueta: "Infantil",
        precioUnitario: 92000,
        categoria:
          categorias.find((c) => c.nombre.includes("Infantil")) ||
          categorias[0],
        material:
          materiales.find((m) => m.nombre.includes("MDF")) || materiales[0],
        imagenes: [
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
        ],
      },
    ];

    for (const m of muebles) {
      try {
        const existe = await em.findOne(Mueble, { descripcion: m.descripcion });

        if (!existe) {
          // Extraer IDs de las entidades relacionadas
          const dataToValidate = {
            descripcion: m.descripcion,
            stock: m.stock,
            etiqueta: m.etiqueta,
            precioUnitario: m.precioUnitario,
            categoria: m.categoria.id,
            material: m.material.id,
            imagenes: m.imagenes,
          };
          const validatedData = MuebleSchema.parse(dataToValidate);
          em.create(Mueble, {
            ...validatedData,
            activo: true,
            categoria: m.categoria,
            material: m.material,
          });
        }
      } catch (error) {
        if (error instanceof ZodError) {
          console.error(`Error validando mueble ${m.etiqueta}:`, error.issues);
          throw error;
        }
        throw error;
      }
    }
    await em.flush();
    console.log("Muebles creados.");
  }
}
