import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  nombre: string ="fernando";
  edad = 21;
  user1: string = "";

  lista: any =[
    {
      nombreU:"raquel",
      edad: 20,
      direccionU: "Calle San Martin"
    }
  ]

  constructor(private router: Router) {}

  sumar(){
    this.nombre;
    console.log("Hola gente del publico");
  }

  IrPagina(){
    this.router.navigate(['/pagina1']);
  }

}
