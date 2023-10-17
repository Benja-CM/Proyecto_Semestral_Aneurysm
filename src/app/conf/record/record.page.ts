import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DbserviceService } from 'src/app/services/dbservice.service';

@Component({
  selector: 'app-record',
  templateUrl: './record.page.html',
  styleUrls: ['./record.page.scss'],
})
export class RecordPage implements OnInit {

  isModalOpen = false;

  arregloCompra: any = [];
  arregloDetalle: any = [];

  compra: any = [];

  userID: any = '';

  constructor(private router: Router, private activeRouter: ActivatedRoute, private db: DbserviceService) {
    this.activeRouter.queryParams.subscribe(param => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.userID = this.router.getCurrentNavigation()?.extras?.state?.['id'];
      }
    });
  }

  ngOnInit() {

    let usID = localStorage.getItem('usuario');
    this.userID = usID;

    this.onInit();
  }

  async onInit(){
    let compras = await this.db.encontrarComprasUsuario(this.userID);
    if (compras !== null) {
      this.arregloCompra = compras;
    }
  }

  async setOpen(isOpen: boolean, id: any) {

    const detalles = await this.db.encontrarDetalle(id);

    if (detalles !== null) {
      this.arregloDetalle = detalles;
    } else {
      return;
    }

    let compra = await this.db.encontrarCompraID(id);
    this.compra = compra;

    console.log(compra);
    console.log(this.compra);
    console.log(detalles);
    console.log(this.arregloDetalle);

    this.isModalOpen = isOpen;
  }

  setOpen1(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
}
