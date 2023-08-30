import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

@Component({
  selector: 'app-tab1view',
  templateUrl: './tab1view.page.html',
  styleUrls: ['./tab1view.page.scss'],
})
export class Tab1viewPage implements OnInit {

  idRecibida: number = 0;
  producto: any = {};

  
  isAlertOpen = false;
  public alertButtons = ['OK'];

  constructor(
    private router: Router,
    private activeRouter: ActivatedRoute,
    private http: HttpClient) {
    this.activeRouter.queryParams.subscribe(param => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.idRecibida = this.router.getCurrentNavigation()?.extras?.state?.['id'];
      }
    })
  }

  ngOnInit() {
    this.getProducto(this.idRecibida).subscribe(producto => {
      if (producto) {
        this.producto = producto;
        console.log(this.producto);
      } else {
        console.error('Producto no encontrado.');
      }
    });
  }

  getProducto(id: number) {
    return this.http.get("assets/datos_internos/productos.json")
      .pipe(
        map((res: any) => {
          const productos = res.data;
          const productoEncontrado = productos.find((producto: any) => producto.id === id);
          return productoEncontrado;
        })
      );
  }

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  comprar() {
    this.setOpen(true);
  }

  agregarCar() {
    let navigationExtras: NavigationExtras = {
      state: {
        producto: this.producto
      }
    }
    console.log(this.producto)
    this.router.navigate(['/tabs/tab3'], navigationExtras)
  }

}

