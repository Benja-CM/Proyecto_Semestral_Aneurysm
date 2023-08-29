import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-changepsswd',
  templateUrl: './changepsswd.page.html',
  styleUrls: ['./changepsswd.page.scss'],
})
export class ChangepsswdPage implements OnInit {
  clave: string = "";
  claveRep: string = "";
  flag: boolean = true;
  msj: string = "";

  constructor(private router: Router, private alerta: AlertController) { }

  ngOnInit() {
  }

  irMiperfil(){
    this.router.navigate(['/tabs/tab4']);
  }

  //Validaciones
  envioValido() {
    this.claveValida();
    this.claveRepValid();
    if (this.flag === true) {
      this.msj = "Contraseña cambiada correctamente";
      this.irMiperfil();
    }
  }

  claveValida() {
    if (!this.contieneMayuscula(this.clave)) {
      this.flag = false;
      this.msj = "La contraseña debe poseer una mayúscula";
      this.presentAlert(this.msj);
    } else if (!this.contieneMinuscula(this.clave)) {
      this.flag = false;
      this.msj = "La contraseña debe poseer una minúscula";
      this.presentAlert(this.msj);
    } else if (!this.contieneNumero(this.clave)) {
      this.flag = false;
      this.msj = "La contraseña debe poseer un número";
      this.presentAlert(this.msj);
    } else if (!this.contieneCaracterEspecial(this.clave)) {
      this.flag = false;
      this.msj = "La contraseña debe poseer un carácter especial";
      this.presentAlert(this.msj);
    } else if (this.clave.length <= 8) {
      this.flag = false;
      this.msj = "La contraseña debe tener al menos 8 caracteres de longitud";
      this.presentAlert(this.msj);
    }
  }

  claveRepValid() {
    if (this.claveRep != this.clave) {
      this.flag = false;
      this.msj = "La contraseña no se ha repetido correctamente";
      this.presentAlert(this.msj);
    }
  }

  async presentAlert(mensaje: string) {
    const alert = await this.alerta.create({
      header: 'Atención',
      subHeader: 'Mensaje importante',
      message: mensaje,
      buttons: ['Vale'],
    });

    await alert.present();
  }

  //Funciones de validación
  contieneMayuscula(texto: string): boolean {
    return /[A-Z]/.test(texto);
  }

  // Función para verificar si una cadena contiene al menos una minúscula
  contieneMinuscula(texto: string): boolean {
    return /[a-z]/.test(texto);
  }

  // Función para verificar si una cadena contiene al menos un carácter especial
  contieneCaracterEspecial(texto: string): boolean {
    return /[!@#$%^&*()_+{}[]:;<>,.?~\/-]/.test(texto);
  }

  // Función para verificar si una cadena contiene al menos un número
  contieneNumero(texto: string): boolean {
    return /\d/.test(texto);
  }
}
