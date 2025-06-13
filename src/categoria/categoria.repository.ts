import {Repository} from '../shared/repository.js';
import {Categoria} from './categoria.entity.js';

const categorias = [
    new Categoria(
        'Sillones',
        'sillones de todo tipo',
        'https://img.freepik.com/free-photo/grey-comfortable-armchair-isolated-white-background_181624-25295.jpg?t=st=1749833467~exp=1749837067~hmac=83474b1a516d395cf012f252b75776542612e9fac645a061b73fce43c46fec5f&w=1380',
        'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
    ),
]

export class CategoriaRepository implements Repository<Categoria> {
    public findAll(): Categoria[] | undefined {
        return categorias;
    }

    public findOne(item: {id: string}): Categoria | undefined {
        return categorias.find((categoria) => categoria.idCategoria === item.id);
    }

    public add(item: Categoria): Categoria | undefined {
        categorias.push(item);
        return item;
    }

    public update(item: Categoria): Categoria | undefined {
        const categoriaIdx = categorias.findIndex((categoria) => categoria.idCategoria === item.idCategoria);
        if (categoriaIdx !== -1) {
            categorias[categoriaIdx] = {...categorias[categoriaIdx], ...item};
            return categorias[categoriaIdx];
        }
    }

    public delete(item: {id: string}): Categoria | undefined {
        const categoriaIdx = categorias.findIndex((categoria) => categoria.idCategoria === item.id);
        if (categoriaIdx !== -1) {
            const deletedCategoria = categorias[categoriaIdx];
            categorias.splice(categoriaIdx, 1);
            return deletedCategoria;
        }
    }
}