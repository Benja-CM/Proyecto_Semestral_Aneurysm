import { Categoria } from "./categoria";
import { Producto } from "./producto";

export class CPUnion {
    id!: number;
    producto!: Producto;
    categoria!: Categoria;
}
