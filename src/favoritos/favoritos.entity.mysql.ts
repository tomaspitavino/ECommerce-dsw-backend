import { Entity, ManyToOne, Rel } from "@mikro-orm/core";
import { Usuario } from "../usuario/usuario.entity.mysql.js";
import { Mueble } from "../mueble/mueble.entity.mysql.js";
import { BaseEntity } from "../shared/db/baseEntity.entity.mysql.js";

@Entity()
export class Favorito extends BaseEntity {
  @ManyToOne(() => Usuario)
  usuario!: Rel<Usuario>;

  @ManyToOne(() => Mueble)
  mueble!: Rel<Mueble>;
}
