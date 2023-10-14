import { Categoria } from "./categoria";

export class Producto {
    id!: number;
    nombre!: string;
    descripcion!: string;
    precio!: number;
    stock!: number;
    req_minimo!: string;
    req_recomendado!: string;
    foto!: string;
    
}
