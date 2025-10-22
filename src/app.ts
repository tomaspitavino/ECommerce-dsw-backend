import { RequestContext } from '@mikro-orm/core';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import 'reflect-metadata';
import { categoriaRouter } from './categoria/categoria.routes.js';
import { clienteRouter } from './cliente/cliente.routes.js';
import { descuentoRouter } from './descuento/descuento.routes.js';
import { itemRouter } from './item/item.routes.js';
import { materialRouter } from './material/material.routes.js';
import { muebleRouter } from './mueble/mueble.routes.js';
import { orm, syncSchema } from './shared/db/orm.js';

const app = express();
app.use(express.json());

app.use((req, res, next) => {
	RequestContext.create(orm.em, next);
});

const allowedOrigins = process.env.CORS_ORIGIN
	? process.env.CORS_ORIGIN.split(',')
	: [];

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin || allowedOrigins.includes(origin))
				return callback(null, true);
			return callback(new Error(`CORS bloqueado para origen: ${origin}`));
		},
		credentials: true,
	})
);

const port = 3000;

// Revisar paths
app.use('/api/clientes', clienteRouter);
app.use('/api/clientes/:id/favoritos', clienteRouter); // para favoritos
app.use('/api/clientes/:id/pedidos', clienteRouter); // para pedidos

app.use('/api/categorias', categoriaRouter);
app.use('/api/materiales', materialRouter);
app.use('/api/muebles', muebleRouter);
app.use('/api/descuentos', descuentoRouter);
app.use('/api/items', itemRouter);

await syncSchema(); // never in production

app.listen(port, () => {
	console.log(`Listening on http://localhost:${port}/`);
});
