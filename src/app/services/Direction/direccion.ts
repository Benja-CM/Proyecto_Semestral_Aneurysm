import { Usuario } from "../User/usuario";
import { Comuna } from "./comuna";

export class Direccion {
    id!: number;
    calle!: string;
    numero!: number;
    cod_postal!: number;

    //Foranea
    comuna!: Comuna;
    usuario!: Usuario;
}
