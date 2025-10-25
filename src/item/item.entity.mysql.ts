import { Entity, ManyToOne, Property, Rel } from '@mikro-orm/core';
import { Mueble } from '../mueble/mueble.entity.mysql.js';
import { Pedido } from '../pedido/pedido.entity.mysql.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.mysql.js';

/* export enum ItemEstado {
	EN_CARRITO = 'en carrito',
	PENDIENTE = 'pendiente',
	EN_PROCESO = 'en proceso',
	COMPLETADO = 'completado',
	CANCELADO = 'cancelado',
} */

@Entity()
export class Item extends BaseEntity {
	// Valor calculado de item.cantidad * mueble.precioUnitario
	@Property({ type: 'decimal', precision: 10, scale: 2 })
	subtotal!: number;

	// Estado del item con valor por defecto
	@Property({ default: 'en carrito' })
	estado!: string;

	// Deberia iniciar con 1 ya que es la cantidad por defecto de un producto en un pedido
	@Property({ default: 1 })
	cantidad!: number;

	@ManyToOne(() => Mueble)
	mueble!: Rel<Mueble>;

	@ManyToOne(() => Pedido, { nullable: true })
	pedido!: Rel<Pedido>;
}
