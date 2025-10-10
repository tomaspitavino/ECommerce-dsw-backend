import {
  Cascade,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
  Rel,
} from "@mikro-orm/core";
import { Cliente } from "../cliente/cliente.entity.mysql.js";
import { Descuento } from "../descuento/descuento.entity.mysql.js";
import { Item } from "../item/item.entity.mysql.js";
import { BaseEntity } from "../shared/db/baseEntity.entity.mysql.js";

@Entity()
export class Pedido extends BaseEntity {
  @ManyToOne(() => Cliente, { nullable: false })
  cliente!: Rel<Cliente>;

  // Estoy considerando que la entidad item es una relación con atributos entre Cliente y Pedido
  @OneToMany(() => Item, (linea) => linea.pedido, {
    cascade: [Cascade.ALL],
  })
  lineas = new Collection<Item>(this);

  @Property()
  fechaHora!: Date;

  @Property({ default: "pendiente" })
  estado!: string;

  @Property()
  total!: number;

  @OneToMany(() => Descuento, (d) => d.pedido, {
    cascade: [Cascade.PERSIST],
    orphanRemoval: false, // no borra descuentos al eliminar pedido
  })
  descuentos = new Collection<Descuento>(this);
}
