import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-listar-us',
  templateUrl: './listar-us.page.html',
  styleUrls: ['./listar-us.page.scss'],
})
export class ListarUsPage implements OnInit {
  isAlertOpen: boolean = false;
  selectedUserType: string = 'cliente';

  constructor(private alertController: AlertController,) { }

  ngOnInit() {
  }

  async isOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Modificar el tipo de usuario',
      inputs: [
        {
          label: 'Cliente',
          type: 'radio',
          value: 'cliente',
          checked: true,
        },
        {
          label: 'Vendedor',
          type: 'radio',
          value: 'vendedor',
        },
        {
          label: 'Administrador',
          type: 'radio',
          value: 'admin',
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
            this.selectedUserType = selectedValue;
          },
        },
      ],
    });

    await alert.present();
  }

}
