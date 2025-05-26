import express, {NextFunction, Request, Response} from 'express';
import {Cliente} from './cliente.js';

const app = express();
app.use(express.json());
const port = 3000;

// get /api/characters/ -> obtener lista de characters
// get /api/characters/:id -> obtener el character con id = id
// put y patch /api/characters/:id -> modifican characters con id = id (tienen sus diferencias)

const clientes = [
	new Cliente(
		'Agustin',
		'Gomez',
		'Calle Falsa 123',
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

function sanitizeCharacterInput(
	req: Request,
	res: Response,
	next: NextFunction
) {
	req.body.sanitizedInput = {
		nombre: req.body.nombre,
		apellido: req.body.apellido,
		direccion: req.body.direccion,
		telefono: req.body.telefono,
		dni: req.body.dni,
		usuario: req.body.usuario,
		email: req.body.email,
		contrasenia: req.body.contrasenia,
		historialCompras: req.body.historialCompras,
		fondos: req.body.fondos,
		puntos: req.body.puntos,
		favoritos: req.body.favoritos,
	};

	Object.keys(req.body.sanitizedInput).forEach((key) => {
		if (req.body.sanitizedInput[key] === undefined) {
			delete req.body.sanitizedInput[key];
		}
	});
	next();
}

app.get('/api/clientes', (req, res) => {
	res.json({data: clientes});
});

app.get('/api/clientes/:id', (req, res) => {
	const cliente = clientes.find((cliente) => cliente.id === req.params.id);
	if (!cliente) {
		res.status(404).send({message: 'Cliente no encontrado'});
		return;
	}
	res.json({data: cliente});
});

app.post('/api/clientes', sanitizeCharacterInput, (req, res) => {
	const input = req.body.sanitizedInput;

	const cliente = new Cliente(
		input.nombre,
		input.apellido,
		input.direccion,
		input.telefono,
		input.dni,
		input.usuario,
		input.email,
		input.contrasenia,
		input.historialCompras,
		input.fondos,
		input.puntos,
		input.favoritos
	);

	clientes.push(cliente);
	res.status(201).send({message: 'Cliente creado', data: cliente});
	return;
});

app.put('/api/clientes/:id', sanitizeCharacterInput, (req, res) => {
	const clienteIdx = clientes.findIndex(
		(cliente) => cliente.id === req.params.id
	);
	if (clienteIdx === -1) {
		res.status(404).send({message: 'Cliente no encontrado'});
		return;
	}
	clientes[clienteIdx] = {
		...clientes[clienteIdx],
		...req.body.sanitizedInput,
	};

	res
		.status(200)
		.send({message: 'Cliente actualizado', data: clientes[clienteIdx]});
	return;
});

app.patch('/api/clientes/:id', sanitizeCharacterInput, (req, res) => {
	const clienteIdx = clientes.findIndex(
		(cliente) => cliente.id === req.params.id
	);

	if (clienteIdx === -1) {
		res.status(404).send({message: 'Cliente no encontrado'});
	}

	clientes[clienteIdx] = {
		...clientes[clienteIdx],
		...req.body.sanitizedInput,
	};

	res.status(200).send({
		message: 'Cliente actualizado parcialmente',
		data: clientes[clienteIdx],
	});
});

app.delete('/api/clientes/:id', (req, res) => {
	const clienteIdx = clientes.findIndex(
		(cliente) => cliente.id === req.params.id
	);
	if (clienteIdx === -1) {
		res.status(404).send({message: 'Cliente no encontrado'});
	}
	clientes.splice(clienteIdx, 1);
	res.status(204).send({message: 'Cliente eliminado'});
});

app.use((_, res) => {
	res.status(404).send({message: 'Ruta no encontrada'});
});

app.listen(port, () => {
	console.log(`Listening on http://localhost:${port}/`);
});
