import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DbserviceService } from '../services/dbservice.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  arregloDetalleProducto: any = [];

  isAlertOpen = false;
  public alertButtons = ['OK'];

  userID: any = '';
  total: number = 0;

  constructor(private router: Router, private activeRouter: ActivatedRoute, private db: DbserviceService, private alertController: AlertController) { }

  ngOnInit() {
    let usID = localStorage.getItem('usuario')
    this.userID = usID;
  }

  ionViewWillEnter() {
    let usID = localStorage.getItem('usuario')
    this.userID = usID;
    if (this.userID !== '') {
      this.getDetalle();
    }
  }

  async getDetalle() {
    this.arregloDetalleProducto = [];
    this.total = 0;

    const compra = await this.db.encontrarCompra(this.userID);

    if (compra !== null) {
      console.log("yeh1");
      let detalle = await this.db.encontrarDetalle(compra.id);

      if (detalle !== null) {
        console.log("yeh2");
        console.log(detalle);

        for (let detalles of detalle) {
          const producto = await this.db.encontrarProducto(detalles.producto);

          const nuevoDetalle = { detalle: detalles, producto: producto };

          this.arregloDetalleProducto.push(nuevoDetalle);

          let cantidad = detalles.cantidad;
          let precio = producto!.precio;
          this.total = this.total + (cantidad * precio);

          console.table("arreglo: ", this.arregloDetalleProducto);
        }

      }
    }
  }

  async comprar() {
    const usuario = await this.db.encontrarUsuarioID(this.userID);
    if (this.userID !== '') {
      if (usuario !== null && usuario.nombre !== '') {
        const alert = await this.alertController.create({
          header: 'El total a pagar es ' + this.total,
          subHeader: '¿Está seguro de que quiere realizar la compra?',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
            },
            {
              text: 'OK',
              handler: () => {
                this.setOpen(true);

                this.compraRealizada();
              },
            },
          ],
        });

        await alert.present();
      } else {
        this.db.presentAlert('Error', '', 'Debes rellenar la información de tu perfil para comprar');
        console.log("nombre: " + usuario?.nombre);
      }
    } else {
      this.db.presentAlert('Error', '', 'Debes iniciar sesión para poder comprar');
    }
  }

  async borrar(id: any, index: any) {
    const alert2 = await this.alertController.create({
      header: '¿Está seguro?',
      subHeader: '¿Quiere eliminar este pedido del carrito?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Sí',
          handler: () => {
            this.borrarDetalle(id, index);
          },
        },
      ],
    });

    await alert2.present();
  }

  async borrarDetalle(id: any, index: any) {
    await this.db.borrarDetalle(id);
    this.arregloDetalleProducto.splice(index, 1);
  }

  async compraRealizada() {
    const compra = await this.db.encontrarCompra(this.userID);

    if (compra !== null) {
      let total: number = 0;
      for (let arreglo of this.arregloDetalleProducto) {
        let id = arreglo.detalle.id;
        let cantidad = arreglo.detalle.cantidad;
        let subtotal = arreglo.detalle.cantidad * arreglo.producto.precio;
        let producto = arreglo.detalle.producto;
        let compra = arreglo.detalle.compra;
        let nombre = arreglo.producto.nombre;
        let precio = arreglo.producto.precio;
        let foto = arreglo.producto.foto;

        const prod = await this.db.encontrarProducto(producto);
        if (prod !== null) {

          let stock = prod.stock - cantidad;

          console.log("prod stock: " + arreglo.producto.stock);
          console.log("real stock: " + prod.stock);
          console.log("new stock: " + stock);

          total = total + subtotal + 2000;

          await this.db.actualizarInfoDetalle(id, cantidad, subtotal, producto, nombre, precio, foto);
          await this.db.actualizarStock(producto, stock);
        }
      }

      const fechaActual = new Date();

      const year = fechaActual.getFullYear();
      const month = fechaActual.getMonth() + 1; // getMonth() devuelve un número de 0 a 11, por lo que se sumam 1
      const day = fechaActual.getDate();
      const hour = fechaActual.getHours();
      const minutes = fechaActual.getMinutes();
      const formattedDate = `${day}-${month}-${year} ${hour}:${minutes}`;

      fechaActual.setDate(fechaActual.getDate() + 3);

      const year1 = fechaActual.getFullYear();
      const month1 = fechaActual.getMonth() + 1; // getMonth() devuelve un número de 0 a 11, por lo que se sumam 1
      const day1 = fechaActual.getDate();
      const formattedDate1 = `${day1}-${month1}-${year1}`;

      fechaActual.setDate(fechaActual.getDate() + 8);

      const year2 = fechaActual.getFullYear();
      const month2 = fechaActual.getMonth() + 1; // getMonth() devuelve un número de 0 a 11, por lo que se sumam 1
      const day2 = fechaActual.getDate();
      const formattedDate2 = `${day2}-${month2}-${year2}`;

      await this.db.actualizarCompra(compra.id, formattedDate, formattedDate1, formattedDate2, 2000, total, 1, this.userID);
      await this.db.agregarCompra(this.userID);
      await this.ionViewWillEnter();
    }
  }

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

}
