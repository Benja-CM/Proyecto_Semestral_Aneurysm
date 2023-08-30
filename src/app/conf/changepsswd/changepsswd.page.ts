import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-changepsswd',
  templateUrl: './changepsswd.page.html',
  styleUrls: ['./changepsswd.page.scss'],
})
export class ChangepsswdPage implements OnInit {
  clave: string = "";
  claveRep1: string = "";
  claveRep2: string = "";

  claveVieja: string = "Aneurysm45*"

  changePassForm = this.formBuilder.group({
    clave: new FormControl('', {
      validators: [
        Validators.required
      ]
    }),
    claveRep1: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30),
        Validators.pattern("^(?=.*[a-z]).*$")
      ]
    }),
    claveRep2: new FormControl('', {
      validators: [
        Validators.required
      ]
    })
  })

  isAlertOpen = false;
  public alertButtons = ['OK'];

  isSubmitted = false;
  submitError = "";

  constructor(
    private router: Router,
    private alerta: AlertController,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
  }

  async onSubmit() {
    this.isSubmitted = true;
    console.log(this.changePassForm.value);

    this.confClaveVieja(this.changePassForm.value.clave, this.claveVieja);
    this.claveValida(this.changePassForm.value.claveRep1);
    this.confClave(this.changePassForm.value.claveRep1, this.changePassForm.value.claveRep2);

    if (!this.changePassForm.valid) {
      console.log("not valid");
      return;
    }

    console.log("valid");
    this.isAlertOpen = true;
  }

  isOpen(state: boolean){
    if (state === false) {
      this.router.navigate(['/tabs/tab4'])
    }
  }

  claveValida(claveRep1: any) {
    if (/^(?=.*[A-Z]).*$/.test(claveRep1) == false) {
      this.changePassForm.controls['claveRep1'].setErrors({ 'errorMayus': true })
    }
    if (/^(?=.*[!@#$&*_+.?~]).*$/.test(claveRep1) == false) {
      this.changePassForm.controls['claveRep1'].setErrors({ 'errorCarEspecial': true })
    }
    if (/^(?=.*[\d*]).*$/.test(claveRep1) == false) {
      this.changePassForm.controls['claveRep1'].setErrors({ 'errorNumerico': true })
    }
  }

  confClaveVieja(clave: any, claveVieja: any) {
    if (clave !== claveVieja) {
      this.changePassForm.controls['clave'].setErrors({ 'notMatch': true })
    }
  }

  confClave(claveRep1: any, claveRep2: any) {
    if (claveRep1 !== claveRep2) {
      this.changePassForm.controls['claveRep2'].setErrors({ 'notMatch': true })
    }
  }

  public validation_messages = {
    'clave': [
      { type: 'required', message: 'La nueva contraseña es obligatoria' },
      { type: 'notMatch', message: 'La contraseña debe coincidir con la contraseña vieja' }
    ],
    'claveRep1': [
      { type: 'required', message: 'La primera contraseña es obligatoria' },
      { type: 'minlength', message: 'La nueva contraseña debe tener 8 o más caracteres' },
      { type: 'maxlength', message: 'La nueva contraseña debe tener 30 o menos caracteres' },
      { type: 'pattern', message: 'La nueva contraseña debe llevar una una minuscula' },
      { type: 'errorMayus', message: 'La nueva contraseña debe llevar una mayuscula' },
      { type: 'errorCarEspecial', message: 'La nueva contraseña debe llevar un caracter especial' },
      { type: 'errorNumerico', message: 'La nueva contraseña debe llevar un número' },
    ],
    'claveRep2': [
      { type: 'required', message: 'La confirmación de contraseña es obligatoria' },
      { type: 'notMatch', message: 'La contraseña debe coincidir con la contraseña elegida' }
    ]
  }

}
