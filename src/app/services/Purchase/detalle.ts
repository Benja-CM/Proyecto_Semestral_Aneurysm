import { Producto } from "../Product/producto";

export class Detalle {
    id!: number;
    cantidad!: number;
    subtotal!: number;

    //Foranea
    producto!: Producto;
}
