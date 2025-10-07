import { Entity, ManyToOne, OneToMany, Property, Rel, Collection, Cascade } from '@mikro-orm/core';
import { Cliente } from '../cliente/cliente.entity.mysql.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.mysql.js';
import { lineaPedido } from '../lineaPedido/lineaPedido.entity.mysql.js';

@Entity()
export class Pedido extends BaseEntity {
    @Property()
    fecha!: Date;

    @Property()
    montoTotal!: number;

    @ManyToOne(() => Cliente, { nullable: false })
    cliente!: Rel<Cliente>;

    // Estoy considerando que la entidad lineaPedido es una relación con atributos entre Cliente y Pedido
    @OneToMany(() => lineaPedido, (lineaPedido) => lineaPedido.pedido, { cascade: [Cascade.ALL] })
    lineaPedido = new Collection<lineaPedido>(this);
}
