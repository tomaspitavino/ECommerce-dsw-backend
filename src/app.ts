import {RequestContext} from '@mikro-orm/core';
import express from 'express';
import 'reflect-metadata';
import {categoriaRouter} from './categoria/categoria.routes.js';
import {clienteRouter} from './cliente/cliente.routes.js';
import {orm, syncSchema} from './shared/db/orm.js';
// import cors from 'cors';

const app = express();
app.use(express.json());

app.use((req, res, next) => {
	RequestContext.create(orm.em, next);
});

/*
app.use(
	cors({
		origin: '*', // Permitir todas las solicitudes de origen cruzado
		credentials: true, // Permitir credenciales (cookies, autenticación HTTP, etc.)
	})
);
*/

const port = 3000;

app.use('/api/clientes', clienteRouter);
app.use('/api/categorias', categoriaRouter);

app.use((_, res) => {
	res.status(404).send({message: 'Ruta no encontrada'});
});

await syncSchema(); // never in production

app.listen(port, () => {
	console.log(`Listening on http://localhost:${port}/`);
});
