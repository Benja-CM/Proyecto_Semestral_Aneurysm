import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  Productos: any = [];

  constructor(
    private router: Router,
    private http: HttpClient) { }


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
}
