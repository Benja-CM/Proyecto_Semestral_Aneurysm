import { Pregunta } from "./pregunta";
import { Rol } from "./rol";

export class Usuario {
    id!: number;
    rut!: number;
    dvrut!: string;
    nombre!: string;
    apellido!: string;
    telefono!: number;
    correo!: string;
    clave!: string;
    respuesta!: string;

    //Foraneas
    rol!: Rol;
    pregunta!: Pregunta;
}
