import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { map } from "rxjs/operators";
import { DbserviceService } from '../services/dbservice.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  juegos: string = "";
  arregloProductos: any = [];
  ProductosFilter: any = [];
  id: number = 0;

  constructor(private router: Router, private http: HttpClient, private db: DbserviceService) {
  }

  ngOnInit() {
    this.init();
  }

  async init() {
    this.db.buscarProducto();
    this.db.dbState().subscribe(data => {
      if (data) {
        this.db.fetchProducto().subscribe(item => {
          this.arregloProductos = item;
        })
      }
    });
  }

  getItem() {
    const objectKey = 'nombre';

    this.ProductosFilter = [];

    for (const producto of this.arregloProductos) {

      if (producto[objectKey].toLowerCase().includes(this.juegos.toLowerCase())) {
        this.ProductosFilter.push(producto);
      }

      if (this.juegos === ""){
        this.ProductosFilter = [];
      }
    }
  }

  getId(productoId: number) {
    for (const producto of this.ProductosFilter) {
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
    this.router.navigate(['/tabs/tab2/tab2view'], navigationExtras)
  }
}
