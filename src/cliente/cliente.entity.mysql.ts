import {
	Cascade,
	Collection,
	Entity,
	OneToMany,
	PrimaryKey,
	Property,
	Rel,
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

	@Property({nullable: true})
	favoritos?: string[]; // Relación many-to-many con Mueble, se puede definir como una colección si se usa un ORM
}

// export class Cliente {
// 	constructor(
// 		public nombre: string,
// 		public apellido: string,
// 		public direccion: string,
// 		public telefono: string,
// 		public dni: string,
// 		public usuario: string,
// 		public email: string,
// 		public contrasenia: string,
// 		public pedidos: string[] = [], // eventualmente el tipo debería ser Pedido, es decir una one-to-many con Pedido
// 		public historialCompras: CompraHistorial[] = [],
// 		public fondos: number = 0,
// 		public puntos: number = 0,
// 		public favoritos: string[] = [], // favoritos es relacion entre Cliente y Mueble, por lo que es many-to-many con muebles
// 		public id = crypto.randomUUID()
// 	) {}
// }
