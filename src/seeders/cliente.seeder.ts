import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Cliente } from '../cliente/cliente.entity.mysql.js';

export class ClienteSeeder extends Seeder {
	async run(em: EntityManager): Promise<void> {
		const clientesData = [
			{
				nombre: 'Administrador',
				apellido: 'General',
				direccion: 'Calle Central 100',
				telefono: '1122334455',
				dni: '273456789',
				usuario: 'admin',
				email: 'admin@muebleria.com',
				contrasenia: 'admin1234',
				rol: 'admin',
				fondos: 100000,
			},
			{
				nombre: 'Juan',
				apellido: 'Pérez',
				direccion: 'Calle Falsa 123',
				telefono: '1234567890',
				dni: '34567890',
				usuario: 'juanperez',
				email: 'juanp@mail.com',
				contrasenia: 'usuario123',
				rol: 'user',
				fondos: 5000,
			},
			{
				nombre: 'Luffy',
				apellido: 'Monkey D.',
				direccion: 'East Blue 01',
				telefono: '1189001122',
				dni: '37112238',
				usuario: 'luffy',
				email: 'luffy@onepiece.jp',
				contrasenia: 'gomuGomu123',
				rol: 'user',
				fondos: 2100,
			},
			{
				nombre: 'Goku',
				apellido: 'Son',
				direccion: 'Monte Paoz 77',
				telefono: '1199988877',
				dni: '30125456',
				usuario: 'gokuson',
				email: 'goku@kamehouse.com',
				contrasenia: 'kamehameha123',
				rol: 'user',
				fondos: 1500,
			},
			{
				nombre: 'Vegeta',
				apellido: 'Saiyan',
				direccion: 'Calle Capsule 12',
				telefono: '1165432109',
				dni: '32148976',
				usuario: 'vegeta_saiyan',
				email: 'vegeta@capsulecorp.jp',
				contrasenia: 'princeofall',
				rol: 'user',
				fondos: 1800,
			},
		];

		// 📦 Inserción masiva
		for (const data of clientesData) {
			em.create(Cliente, data);
		}

		await em.flush();

		console.log('✅ Clientes creados exitosamente.');
	}
}
