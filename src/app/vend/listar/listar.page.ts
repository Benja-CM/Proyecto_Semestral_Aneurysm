import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ActionSheetController, AlertController, IonModal, ModalController } from '@ionic/angular';
import { map } from "rxjs/operators";
import { DbserviceService } from 'src/app/services/dbservice.service';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.page.html',
  styleUrls: ['./listar.page.scss'],
})
export class ListarPage implements OnInit {
  presentingElement: any = undefined;

  isModalOpen = false;

  Productos: any = [];
  id: number = 0;
  producto: any = {};

  isSubmitted = false;

  isAlertOpen = false;
  public alertButtons = ['OK'];

  arregloProductos: any = [];

  alertFlag: boolean = false;


  constructor(private router: Router, private http: HttpClient, private db: DbserviceService, private alertController: AlertController) { }

  ngOnInit() {
    this.db.buscarProducto();
    this.db.dbState().subscribe(data => {
      if (data) {
        this.db.fetchProducto().subscribe(item => {
          this.arregloProductos = item;
        })
      }
    });
  }

  ionViewWillEnter() {
    this.db.buscarProducto();
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

  getId(productoId: number) {
    for (const producto of this.Productos) {
      if (producto.id === productoId) {
        return productoId;
      }
    }
    return null; // Manejo para cuando no se encuentra la ID
  }

  async presentAlert(id: any) {
    const alert = await this.alertController.create({
      header: '¿Estás seguro?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Alert canceled');
          },
        },
        {
          text: 'Sí',
          handler: () => {
            console.log('Alert confirmed');
            this.alertFlag = true;
            this.eliminar(id);
          },
        },
      ],
    });

    await alert.present();
  }

  eliminar(idProd: any) {
    console.log("uh");

    if (this.alertFlag) {
      console.log("yeh");

      this.db.borrarProducto(idProd);
      this.alertFlag = false;
      this.db.buscarProducto();

    } else {
      console.log("nah");
    }
  }

  modificar(productoId: number) {
    const idEncontrada = productoId;
    let navigationExtras: NavigationExtras = {
      state: {
        id: idEncontrada
      }
    }
    console.log(idEncontrada)
    this.router.navigate(['/listar/modificar'], navigationExtras)
  }

}
