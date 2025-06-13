import crypto from 'node:crypto';

export class Categoria {
    constructor(
        public nombre: string,
        public descripcion: string,
        public imagen: string, // URL or file path
        public idCategoria = crypto.randomUUID()
    ) {}
}