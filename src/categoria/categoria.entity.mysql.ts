import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  Property,
} from "@mikro-orm/core";
import { Mueble } from "../mueble/mueble.entity.mysql.js";
import { BaseEntity } from "../shared/db/baseEntity.entity.mysql.js";

@Entity()
export class Categoria extends BaseEntity {
  @Property({ nullable: false, unique: true })
  nombre!: string;

  @Property({ nullable: false })
  descripcion!: string;

  @Property()
  imagen!: string; // URL or file path

  @Property({ nullable: true })
  grupoVisual?: string;

  @OneToMany(() => Mueble, (mueble) => mueble.categoria, {
    cascade: [Cascade.ALL],
  })
  muebles = new Collection<Mueble>(this);
}
