import {NextFunction, Request, Response} from 'express';
import {Categoria} from './categoria.entity.js';
import {CategoriaRepository} from './categoria.repository.js';

const repository = new CategoriaRepository();
function sanitizeCharacterInput(    
    req: Request,
    res: Response,
    next: NextFunction
) {
    req.body.sanitizedInput = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        imagen: req.body.imagen,
    };

    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}

function findAll(req: Request, res: Response) {
    res.json({
        data: repository.findAll(),
    });
}

function findOne(req: Request, res: Response) {
    const id = req.params.idCategoria;
    const categoria = repository.findOne({id});
    if (!categoria) {
        res.status(404).send({message: 'Categoria no encontrada'});
        return;
    }
    res.json({data: categoria});
}

function add(req: Request, res: Response) {
    const input = req.body.sanitizedInput;
    const categoriaInput = new Categoria(
        input.nombre,
        input.descripcion,
        input.imagen
    );
    const categoria = repository.add(categoriaInput);
    res.status(200).send({message: 'Categoria creada', data: categoria});
}

function update(req: Request, res: Response) {
    req.body.sanitizedInput.idCategoria = req.params.idCategoria;
    const categoria = repository.update({...req.body.sanitizedInput});

    if (!categoria) {
        res.status(404).send({message: 'Categoria no encontrada'});
        return;
    }
    res.status(200).send({message: 'Categoria actualizada', data: categoria});
	return;
}

function remove(req: Request, res: Response) {
    const id = req.params.idCategoria;
    const categoria = repository.delete({id});

    if (!categoria) {
        res.status(404).send({message: 'Categoria no encontrada'});
        return;
    }
    res.status(200).send({message: 'Categoria eliminada', data: categoria});
}

export {add, findAll, findOne, remove, sanitizeCharacterInput, update};