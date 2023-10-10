import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DbserviceService } from 'src/app/services/dbservice.service';

@Component({
  selector: 'app-listar-us',
  templateUrl: './listar-us.page.html',
  styleUrls: ['./listar-us.page.scss'],
})
export class ListarUsPage implements OnInit {
  isAlertOpen: boolean = false;
  selectedUserType: string = 'cliente';

  arregloUsuario: any = [
    {
      id: '',
      rut: '',
      dvrut: '',
      nombre: '',
      apellido_pa: '',
      apellido_ma: '',
      telefono: '',
      correo: '',
      clave: '',
      respuesta: '',

      //Datos Foraneos
      rol: '',
      pregunta: '',
    }

  ]

  constructor(private alertController: AlertController, private db: DbserviceService,) {
    this.db.buscarUsuario();
  }

  ngOnInit() {
    this.db.buscarUsuario();
    this.db.dbState().subscribe(res => {
      if (res) {
        this.db.fetchUsuario().subscribe(item => {
          this.arregloUsuario = item;
        })
      }
    })
  }

  async obtenerUsuarios() {
    try {
      const usuarios = await this.db.fetchUsuario().toPromise();
      this.arregloUsuario = usuarios;
      console.info(this.arregloUsuario);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  }

  async isOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  async modificarAlert(userID: any) {
    const alert = await this.alertController.create({
      header: 'Modificar el tipo de usuario',
      inputs: [
        {
          label: 'Cliente',
          type: 'radio',
          value: 1,
        },
        {
          label: 'Vendedor',
          type: 'radio',
          value: 2,
        },
        {
          label: 'Administrador',
          type: 'radio',
          value: 3,
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Ok',
          handler: (selectedValue) => {
            this.db.actualizarRol(userID, selectedValue);
          },
        },
      ],
    });

    await alert.present();
  }

  async eliminarAlert(userID: any) {
    const alertE = await this.alertController.create({
      header: 'Eliminar usuario',
      message: '¿Estas seguro de que quieres eliminar este usuario?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Sí',
          handler: () => {
            this.db.borrarUsuario(userID);
          },
        },
      ],
    });

    await alertE.present();
  }

}
