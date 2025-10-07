import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  Property,
} from "@mikro-orm/core";
import { Pedido } from "../pedido/pedido.entity.mysql.js";
import { BaseEntity } from "../shared/db/baseEntity.entity.mysql.js";
import { Descuento } from "../descuento/descuento.entity.mysql.js";

@Entity()
export class Cliente extends BaseEntity {
  @Property({ nullable: false })
  nombre!: string;

  @Property({ nullable: false })
  apellido!: string;

  @Property({ nullable: false, unique: true })
  direccion!: string;

  @Property({ nullable: false, unique: true })
  telefono!: string;

  @Property({ nullable: false, unique: true })
  dni!: string;

  @Property({ nullable: false, unique: true })
  usuario!: string;

  @Property({ nullable: false, unique: true })
  email!: string;

  @Property({ nullable: false })
  contrasenia!: string;

  @OneToMany(() => Pedido, (pedidos) => pedidos.cliente, {
    cascade: [Cascade.ALL],
  })
  pedidos = new Collection<Pedido>(this);

  @Property()
  fondos: number = 0;

  @Property()
  puntos: number = 0;

  // En realidad favoritos es una relacion con atributos, deberia de ser una entidad
  // Revisar el diagrama
  @Property({ nullable: true })
  favoritos?: string[]; // Relación many-to-many con Mueble, se puede definir como una colección si se usa un ORM

  // @ManyToMany(() => Descuento, (descuento) => descuento.clientes, {
  //     cascade: [Cascade.ALL],
  //     owner: true,
  // })
  // descuentos!: Descuento[];
}
