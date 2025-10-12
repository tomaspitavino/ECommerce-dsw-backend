import { Entity, Property, OneToOne, Rel } from "@mikro-orm/core";
import { Pedido } from "../pedido/pedido.entity.mysql.js";
import { BaseEntity } from "../shared/db/baseEntity.entity.mysql.js";

@Entity()
export class Pago extends BaseEntity {
  @Property({ type: "datetime", nullable: false })
  fechaRealizado!: Date;

  @Property({ nullable: false })
  metodoPago!: string;

  @Property({ type: "decimal", precision: 10, scale: 2, nullable: false })
  importe!: number;

  @OneToOne(() => Pedido, (pedido) => pedido.pago, { nullable: false })
  pedido!: Rel<Pedido>;
}
