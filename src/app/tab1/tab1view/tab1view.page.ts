import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { map, switchMap } from "rxjs/operators";
import { DbserviceService } from 'src/app/services/dbservice.service';

@Component({
  selector: 'app-tab1view',
  templateUrl: './tab1view.page.html',
  styleUrls: ['./tab1view.page.scss'],
})
export class Tab1viewPage implements OnInit {

  idRecibida: number = 0;
  producto: any = [];
  categorias: any = [];
  categoriasFilter: any = [];


  isAlertOpen = false;
  public alertButtons = ['OK'];

  constructor(
    private router: Router, private activeRouter: ActivatedRoute, private http: HttpClient, private db: DbserviceService) {
    this.activeRouter.queryParams.subscribe(param => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.idRecibida = this.router.getCurrentNavigation()?.extras?.state?.['id'];
      }
    })
  }

  ngOnInit() {
    this.getProducto();
    this.getUnion();
  }

  async getProducto() {
    const producto = await this.db.encontrarProducto(this.idRecibida);
    this.producto = producto;
  }

  async getUnion() {
    this.categoriasFilter = [];
    console.log("GetUnion");
    const categorias = await this.db.encontrarUnionPorProducto(this.idRecibida);

    if (categorias !== null) {
      for (const categoria of categorias) {
        const categoriaDetalle = await this.db.encontrarCategoria(categoria.categoria);
        if (categoriaDetalle !== null) {
          this.categoriasFilter.push(categoriaDetalle.nombre);
        }
      }
    } else {
      return;
    }
  }

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  comprar() {
    this.setOpen(true);
    this.db.actualizarStock(this.producto.id, this.producto.stock-1);
    this.getProducto();
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

