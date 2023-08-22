import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from "rxjs/operators";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  juegos: string = "";
  Productos: any = [];
  ProductosFilter: any = [];
  i: number = 0;


  constructor(private router: Router, private http: HttpClient) {
  }

  ngOnInit() {
    this.getProductos().subscribe(res => {
      console.log("Res", res)
      this.Productos = res;
      console.log(this.Productos.name)
    })
  }

  getItem() {
    const objectKey = 'name';

    this.ProductosFilter = [];

    for (const producto of this.Productos) {

      if (producto[objectKey].toLowerCase().includes(this.juegos.toLowerCase())) {
        this.ProductosFilter.push(producto);
      }

      if (this.juegos === ""){
        this.ProductosFilter = [];
      }
    }
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

}
