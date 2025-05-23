import crypto from 'node:crypto';

export class Cliente {
	constructor(
		public name: string,
		public apellido: string,
		public dni: string,
		public usuario: string,
		public email: string,
		public contrasenia: string,
		public historialCompras: array,
		public fondos: number,
		public puntos: number,
		public direccion: string,
		public telefono: string,
		public id = crypto.randomUUID()
	);
}
