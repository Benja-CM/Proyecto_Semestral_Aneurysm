import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { register } from 'swiper/element';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  email: string = "";
  password: string = "";
  resp_secreta: string = "";

  public registerForm = this.formBuilder.group({
    email: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
      ]
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30),
        Validators.pattern("^(?=.*[a-z]).*$")
      ]
    }),
    password_conf: new FormControl('', {
      validators: [
        Validators.required
      ]
    }),
    resp_secreta: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9 ]*$")
      ]
    })
  })

  isSubmitted = false;
  submitError = "";

  constructor(private router: Router,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
  }

  async onSubmit() {
    this.isSubmitted = true;
    console.log(this.registerForm.value);

    this.claveValida(this.registerForm.value.password);
    this.confClave(this.registerForm.value.password, this.registerForm.value.password_conf);

    if (!this.registerForm.valid) {
      console.log("not valid");
      return;
    }

    console.log("valid");
    this.router.navigate(['/tabs/tab4'] /* navigationExtras */)
  }

  claveValida(password: any){
    if (/^(?=.*[A-Z]).*$/.test(password) == false){
      this.registerForm.controls['password'].setErrors({ 'errorMayus': true })
    }
    if (/^(?=.*[!@#$&*_+.?~]).*$/.test(password) == false){
      this.registerForm.controls['password'].setErrors({ 'errorCarEspecial': true })
    }
    if (/^(?=.*[\d*]).*$/.test(password) == false){
      this.registerForm.controls['password'].setErrors({ 'errorNumerico': true })
    }
  }

  confClave(password: any, password_conf: any){
    if (password !== password_conf){
      this.registerForm.controls['password_conf'].setErrors({ 'errorConf': true })
    }
  }

  public validation_messages = {
    'email': [
      { type: 'required', message: 'El correo es obligatorio' },
      { type: 'pattern', message: 'El correo no cumple con el patron' }
    ],
    'password': [
      { type: 'required', message: 'La contraseña es obligatoria' },
      { type: 'minlength', message: 'La contraseña debe tener 8 o más caracteres' },
      { type: 'maxlength', message: 'La contraseña debe tener 30 o menos caracteres' },
      { type: 'pattern', message: 'La contraseña debe llevar una una minuscula' },
      { type: 'errorMayus', message: 'La contraseña debe llevar una mayuscula' },
      { type: 'errorCarEspecial', message: 'La contraseña debe llevar un caracter especial' },
      { type: 'errorNumerico', message: 'La contraseña debe llevar un número' },
    ],
    'password_conf': [
      { type: 'required', message: 'La confirmación de contraseña es obligatoria' },
      { type: 'errorConf', message: 'La contraseña debe coincidir con la contraseña elegida' }
    ],
    'resp_secreta': [
      { type: 'required', message: 'La respuesta secreta es obligatoria' },
      { type: 'pattern', message: 'La respuesta no debe llevar caracteres especiales' }
    ]
  }
}
