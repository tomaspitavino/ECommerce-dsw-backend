import {Repository} from '../shared/repository.js';
import {Cliente} from './cliente.entity.js';

const clientes = [
	new Cliente(
		'Agustin',
		'Gomez',
		'Calle Falsa 124',
		'+51234567890', // peru es clave
		'12345678', // dni
		'agutingome', // usuario
		'agusmail@gmail.com',
		'contrasenia123',
		[],
		1000, // fondos
		50, // puntos
		[],
		'a02b91bc-3769-4221-beb1-d7a3aeba7dad'
	),
];

export class ClienteRepository implements Repository<Cliente> {
	public findAll(): Cliente[] | undefined {
		return clientes;
	}

	public findOne(item: {id: string}): Cliente | undefined {
		return clientes.find((cliente) => cliente.id === item.id);
	}

	public add(item: Cliente): Cliente | undefined {
		return clientes.push(item) ? item : undefined;
	}

	public update(item: Cliente): Cliente | undefined {
		const clienteIdx = clientes.findIndex((cliente) => cliente.id === item.id);
		if (clienteIdx !== -1) {
			clientes[clienteIdx] = {...clientes[clienteIdx], ...item};
		}
		return clientes[clienteIdx];
	}

	public delete(item: {id: string}): Cliente | undefined {
		const clienteIdx = clientes.findIndex((cliente) => cliente.id === item.id);
		if (clienteIdx !== -1) {
			const deletedClientes = clientes[clienteIdx];
			clientes.splice(clienteIdx, 1);
			return deletedClientes;
		}
	}
}
