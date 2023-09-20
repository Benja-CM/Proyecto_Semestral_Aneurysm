import { Region } from "./region";

export class Comuna {
    id!: number;
    nombre!: string;
    cost_envio!: number;

    //Foranea
    region!: Region;
}
