import {
	Cascade,
	Collection,
	Entity,
	OneToMany,
	Property,
} from '@mikro-orm/core';
import {Pedido} from '../pedido/pedido.entity.mysql.js';
import {BaseEntity} from '../shared/db/baseEntity.entity.mysql.js';

@Entity()
export class Cliente extends BaseEntity {
	@Property({nullable: false, unique: true})
	nombre!: string;

	@Property({nullable: false, unique: true})
	apellido!: string;

	@Property({nullable: false, unique: true})
	direccion!: string;

	@Property({nullable: false, unique: true})
	telefono!: string;

	@Property({nullable: false, unique: true})
	dni!: string;

	@Property({nullable: false, unique: true})
	usuario!: string;

	@Property({nullable: false, unique: true})
	email!: string;

	@Property({nullable: false})
	contrasenia!: string;

	@OneToMany(() => Pedido, (pedidos) => pedidos.cliente, {
		cascade: [Cascade.ALL],
	})
	pedidos = new Collection<Pedido>(this);

	// Implementar historial compras más adelante
	// @OneToMany(
	// 	() => HistorialCompra,
	// 	(historialCompras) => historialCompras.cliente,
	// 	{
	// 		cascade: [Cascade.ALL],
	// 	}
	// )
	// historialCompras = new Collection<HistorialCompra>(this);

	@Property()
	fondos: number = 0;

	@Property()
	puntos: number = 0;

	// En realidad favoritos es una relacion con atributos, deberia de ser una entidad
	// Revisar el diagrama
	@Property({nullable: true})
	favoritos?: string[]; // Relación many-to-many con Mueble, se puede definir como una colección si se usa un ORM
}
