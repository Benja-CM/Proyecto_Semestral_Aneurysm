import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

@Component({
  selector: 'app-tab2view',
  templateUrl: './tab2view.page.html',
  styleUrls: ['./tab2view.page.scss'],
})
export class Tab2viewPage implements OnInit {

  idRecibida: number = 0;
  producto: any = {};

  constructor(private router: Router, private activeRouter: ActivatedRoute, private http: HttpClient) {
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

}
