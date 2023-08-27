import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import Swiper from 'swiper';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements OnInit {
  cate: any = [];

  juegos: string = "";
  Productos: any = [];
  ProductosFilter: any = [];
  id: number = 0;

  @ViewChild(' swiper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper;


  constructor(
    private router: Router,
    private http: HttpClient) { }

  swiperSlideChanged(e: any) {
    console.log('changed', e);
  }
  swiperReady() {
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }
  goNext() {
    this.swiper?.slideNext();
  }
  goPrev() {
    this.swiper?.slidePrev();
  }


  ngOnInit() {
    this.getProductos().subscribe(res => {
      console.log("Res", res)
      this.Productos = res;
    })
    this.getCategoria().subscribe(res => {
      console.log("Res", res)
      this.cate = res;
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
  getCategoria() {
    return this.http
      .get("assets/datos_internos/Categorias.json")
      .pipe(
        map((res: any) => {
          return res.cate;
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
