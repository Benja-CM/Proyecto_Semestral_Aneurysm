import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ActionSheetController, IonModal, ModalController } from '@ionic/angular';
import { map } from "rxjs/operators";
import { OverlayEventDetail } from '@ionic/core/components';

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

  constructor(private router: Router, private http: HttpClient, private modalCtrl: ModalController, private actionSheetCtrl: ActionSheetController) { }

  ngOnInit() {
    this.getProductos().subscribe(res => {
      console.log("Res", res)
      this.Productos = res;
    })
    this.presentingElement = document.querySelector('.ion-page');
  }


  canDismiss = async () => {
    if (this.isModalOpen === true) {
      const actionSheet = await this.actionSheetCtrl.create({
        header: '¿Estas Seguro?',
        buttons: [
          {
            text: 'Sí',
            role: 'confirm',

          },
          {
            text: 'No',
            role: 'cancel',
          },
        ],
      });

      actionSheet.present();

      const { role } = await actionSheet.onWillDismiss();

      this.openModal(false);
      return role === 'confirm';
    } else {
      return null;
    }
  };

  openModal(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(null, 'confirm');
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
