import { Usuario } from "../User/usuario";
import { Detalle } from "./detalle";

export class Compra {
    id!: number;
    fech_compra!: string;
    fech_despacho!: string;
    fech_entrega!: string;
    costo_desp!: number;
    total!: number;
    carrito!: boolean;
    estado!: string;

    //Foraneo
    detalle!: Detalle;
    usuario!: Usuario;
}
