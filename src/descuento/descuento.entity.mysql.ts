import { Collection, Entity, ManyToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.mysql.js";
import { Cliente } from "../cliente/cliente.entity.mysql.js";

@Entity()
export class Descuento extends BaseEntity {
  @Property({ nullable: false })
  tipoDescuento!: string;

  @Property({ nullable: false })
  porcentajeDescuento!: number;

  // @ManyToMany(() => Cliente, (cliente) => cliente.descuentos)
  // clientes = new Collection<Cliente>(this)
}
