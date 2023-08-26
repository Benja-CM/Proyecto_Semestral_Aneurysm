import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { map } from "rxjs/operators";

@Component({
  selector: 'app-listar',
  templateUrl: './listar.page.html',
  styleUrls: ['./listar.page.scss'],
})
export class ListarPage implements OnInit {
  Productos: any = [];
  id: number = 0;

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.getProductos().subscribe(res => {
      console.log("Res", res)
      this.Productos = res;
    })
  }

  getProductos() {
    return this.http
      .get("assets/datos_internos/productos.json")
      .pipe(
        map((res: any) => {
          return res.data;
        })
      )
  }

  
  getId(productoId: number) {
    for (const producto of this.Productos) {
      if (producto.id === productoId) {
        return productoId;
      }
    }
    return null; // Manejo para cuando no se encuentra la ID
  }
  
  showProducto(productoId: number) {
    const idEncontrada = this.getId(productoId);
    let navigationExtras: NavigationExtras = {
      state: {
        id: idEncontrada
      }
    }
    console.log(idEncontrada)
    this.router.navigate(['/tabs/tab1/tab1view'], navigationExtras)
  }
}
