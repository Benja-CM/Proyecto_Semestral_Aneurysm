import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { DbserviceService } from 'src/app/services/dbservice.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab2view',
  templateUrl: './tab2view.page.html',
  styleUrls: ['./tab2view.page.scss'],
})
export class Tab2viewPage implements OnInit {

  idRecibida: number = 0;
  producto: any = {};
  categorias: any = [];
  categoriasFilter: any = [];

  isAlertOpen = false;
  public alertButtons = ['OK'];

  userID: any = '';

  constructor(private router: Router, private activeRouter: ActivatedRoute, private db: DbserviceService, private alertController: AlertController) {
    this.activeRouter.queryParams.subscribe(param => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.idRecibida = this.router.getCurrentNavigation()?.extras?.state?.['id'];
      }
    })
  }

  ngOnInit() {
    this.getProducto();
    this.getUnion();

    let usID = localStorage.getItem('usuario');
    this.userID = usID;
  }

  ionViewWillEnter() {
    let usID = localStorage.getItem('usuario')
    this.userID = usID;
    
    this.getProducto();
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

  async comprar() {
    const usuario = await this.db.encontrarUsuarioID(this.userID);
    if (this.userID !== '' && this.userID !== null) {
      if (usuario !== null && usuario.nombre !== '') {
        const alert = await this.alertController.create({
          header: '¿Cuantos productos quieres comprar?',
          inputs: [
            {
              label: 'Cantidad',
              name: 'cantidad',
              type: 'number',
              placeholder: 'Cantidad',
            },
          ],
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
            },
            {
              text: 'OK',
              handler: (data) => {
                const cantidad = parseInt(data.cantidad);

                if (!isNaN(cantidad) && cantidad >= 1 && cantidad <= this.producto.stock) {
                  this.setOpen(true);

                  this.db.actualizarStock(this.producto.id, this.producto.stock - cantidad);
                  this.getProducto();
                  this.compraRealizada(cantidad);
                } else {
                  this.db.presentAlert('Error', '', 'Ingresa una cantidad válida dentro de los límites.');
                }
              },
            },
          ],
        });

        await alert.present();
      } else {
        this.db.presentAlert('Error', '', 'Debes rellenar la información de tu perfil para comprar');
      }
    } else {
      this.db.presentAlert('Error', '', 'Debes iniciar sesión para poder comprar');
    }
  }

  async compraRealizada(cant: any) {
    const compra = await this.db.encontrarCompra(this.userID);
    let subtotal = this.producto.precio * cant;

    if (compra !== null) {
      this.db.agregarDetalle(cant, subtotal, this.producto.id, compra.id, this.producto.nombre, this.producto.precio, this.producto.foto);

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

      this.db.actualizarCompra(compra.id, formattedDate, formattedDate1, formattedDate2, 2000, subtotal+2000, 1, this.userID);
      this.db.agregarCompra(this.userID);
    }
  }

  async agregar() {
    if (this.userID !== '' && this.userID !== null) {
      const alert = await this.alertController.create({
        header: '¿Cuantos productos quieres agregar al carrito?',
        inputs: [
          {
            label: 'Cantidad',
            name: 'cantidad',
            type: 'number',
            placeholder: 'Cantidad',
          },
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'OK',
            handler: (data) => {
              const cantidad = parseInt(data.cantidad);

              if (!isNaN(cantidad) && cantidad >= 1 && cantidad <= this.producto.stock) {
                this.agregarCar(cantidad);
              } else {
                this.db.presentAlert('Error', '', 'Ingresa una cantidad válida dentro de los límites.');
              }
            },
          },
        ],
      });

      await alert.present();
    } else {
      this.db.presentAlert('Error', '', 'Debes iniciar sesión para poder comprar');
    }
  }

  async agregarCar(cant: number) {
    if (this.userID !== '' || this.userID !== null) {
      const compra = await this.db.encontrarCompra(this.userID);
      if (compra !== null) {
        this.db.crearDetalle(cant, this.producto.id, compra.id);

        console.log(this.producto)
        this.router.navigate(['/tabs/tab3'])
      }
    } else {
      this.db.presentAlert("Error", "", "Debes iniciar sesión para poder comprar");
    }
  }

}
