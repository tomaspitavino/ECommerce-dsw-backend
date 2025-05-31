import crypto from 'node:crypto';

// Definición de interfaces para tipado fuerte
interface CompraHistorial {
	pedidoId: string;
	fecha: Date;
	montoTotal: number;
	items: Array<{
		muebleId: string;
		cantidad: number;
		precioUnitario: number;
	}>;
}

export class Cliente {
	constructor(
		public nombre: string,
		public apellido: string,
		public direccion: string,
		public telefono: string,
		public dni: string,
		public usuario: string,
		public email: string,
		public contrasenia: string,
		public historialCompras: CompraHistorial[] = [],
		public fondos: number = 0,
		public puntos: number = 0,
		public favoritos: string[] = [],
		public id = crypto.randomUUID()
	) {}
}
