import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  Property,
} from "@mikro-orm/core";
import { Favorito } from "../favoritos/favoritos.entity.mysql.js";
import { Pedido } from "../pedido/pedido.entity.mysql.js";
import { BaseEntity } from "../shared/db/baseEntity.entity.mysql.js";

@Entity()
export class Usuario extends BaseEntity {
  @Property()
  nombre!: string;

  @Property()
  apellido!: string;

  @Property()
  direccion!: string;

  @Property()
  telefono!: string;

  @Property({ unique: true })
  dni!: string;

  @Property({ unique: true })
  usuario!: string;

  @Property({ unique: true })
  email!: string;

  @Property()
  passwordHash!: string;

  @Property({ default: "cliente" })
  rol!: string; // admin o cliente

  @Property()
  fondos: number = 0;

  @OneToMany(() => Pedido, (pedidos) => pedidos.usuario, {
    cascade: [Cascade.ALL],
  })
  pedidos = new Collection<Pedido>(this);

  @OneToMany(() => Favorito, (favoritos) => favoritos.usuario, {
    cascade: [Cascade.ALL],
  })
  favoritos = new Collection<Favorito>(this);
}
