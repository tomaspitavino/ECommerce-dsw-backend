import express from 'express';
import {clienteRouter} from './cliente/cliente.routes.js';
import {categoriaRouter} from './categoria/categoria.routes.js';

const app = express();
app.use(express.json());
const port = 3000;

app.use('/api/clientes', clienteRouter);
app.use('/api/categorias', categoriaRouter);

app.use((_, res) => {
	res.status(404).send({message: 'Ruta no encontrada'});
});

app.listen(port, () => {
	console.log(`Listening on http://localhost:${port}/`);
});
