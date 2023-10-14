import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import Swiper from 'swiper';
import { DbserviceService } from '../services/dbservice.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements OnInit {
  cate: any = [];

  juegos: string = "";
  arregloProductos: any = [];
  ProductosFilter: any = [];
  id: number = 0;

  arregloProducto: any[] = [
    {
      id: '',
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      req_minimo: '',
      req_recomendado: '',
      foto: '',
    }
  ]

  @ViewChild(' swiper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper;


  constructor(
    private router: Router, private http: HttpClient, private bd: DbserviceService) { }

  ngOnInit() {
  /*   this.onInit(); */
    this.bd.dbState().subscribe(data => {
      if (data) {
        this.bd.fetchProducto().subscribe(item => {
          this.arregloProductos = item;
        })
      }
    });
  }

  ionViewWillEnter() {
    this.bd.buscarProducto();
  }

  async onInit() {
  }

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
    for (const producto of this.arregloProductos) {
      if (producto.id === productoId) {
        return productoId;
      }
    }
    return null; // Manejo para cuando no se encuentra la ID
  }

  getItem() {
    const objectKey = 'nombre';

    this.ProductosFilter = [];

    for (const producto of this.arregloProductos) {

      if (producto[objectKey].toLowerCase().includes(this.juegos.toLowerCase())) {
        this.ProductosFilter.push(producto);
      }

      if (this.juegos === "") {
        this.ProductosFilter = [];
      }
    }
  }

  showProducto(productoId: number) {

    let navigationExtras: NavigationExtras = {
      state: {
        id: productoId
      }
    }
    console.log(productoId)
    this.router.navigate(['/tabs/tab1/tab1view'], navigationExtras)
  }
}
