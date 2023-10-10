import { Usuario } from "../User/usuario";
import { Comuna } from "./comuna";

export class Direccion {
    id!: number;
    calle!: string;
    numero!: number;
    cod_postal!: number;
    region!: string;
    comuna!: string;

    //Foranea
    usuario!: Usuario;
}
