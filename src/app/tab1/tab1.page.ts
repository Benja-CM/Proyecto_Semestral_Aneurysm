import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import Swiper from 'swiper';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  cate: any=[];

  Productos: any = [];

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
    this. swiper= this.swiperRef?.nativeElement.swiper;
  }
    goNext( ){
      this. swiper?. slideNext() ;
    }
    goPrev() {
    this. swiper?. slidePrev();
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
}
