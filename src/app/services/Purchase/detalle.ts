import { Producto } from "../Product/producto";
import { Compra } from "./compra";

export class Detalle {
    id!: number;
    cantidad!: number;
    subtotal!: number;

    //Foranea
    producto!: Producto;
    compra!: Compra;
    nombre!: string;
    precio!: number;
    foto!: string;
}
