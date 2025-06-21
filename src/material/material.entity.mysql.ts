import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  Property,
} from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.mysql.js";
import { Mueble } from "../mueble/mueble.entity.mysql.js";

@Entity()
export class Material extends BaseEntity {
  @Property({ nullable: false, unique: true })
  nroMaterial!: string;

  @Property({ nullable: false })
  nombre!: string;

  @OneToMany(() => Mueble, (mueble) => mueble.material, {
    cascade: [Cascade.ALL],
  })
  muebles = new Collection<Mueble>(this);
}
