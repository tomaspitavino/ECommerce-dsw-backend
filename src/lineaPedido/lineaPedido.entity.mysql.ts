import {
	Cascade,
	Collection,
	Entity,
	ManyToOne,
	OneToMany,
	Property,
	Rel,
} from '@mikro-orm/core';
import {Mueble} from '../mueble/mueble.entity.mysql.js';
import {Pedido} from '../pedido/pedido.entity.mysql.js';
import {BaseEntity} from '../shared/db/baseEntity.entity.mysql.js';

// Revisar esta entidad en el diagrama de clases, ya que parece ser una entidad de relación entre Mueble y Pedido
// Voy a implementar como una entidad de relación con atributos

@Entity()
export class lineaPedido extends BaseEntity {
	// Valor calculado de lineaPedido.cantidad * mueble.precioUnitario
	@Property({nullable: false})
	subtotal!: number;

	// Deberia de iniciar con un estado por defecto, como "pendiente" o "en proceso"
	@Property({nullable: false})
	estado!: string;

	// Deberia iniciar con 1 ya que es la cantidad por defecto de un producto en un pedido
	@Property({nullable: false})
	cantidad!: number;

	// manyToOne con muebles
	@OneToMany(() => Mueble, (mueble) => mueble.lineaPedido, {
		nullable: false,
		cascade: [Cascade.ALL],
	})
	mueble = new Collection<Mueble>(this);

	@ManyToOne(() => Pedido, {nullable: false})
	pedido!: Rel<Pedido>;
}
