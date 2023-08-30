import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = "";
  password: string = "";

  nombre: string = "Administrador Aneurysm"
  correo: string = "aneurysm@gmail.com";
  clave: string = "Aneurysm45*";

  loginForm = this.formBuilder.group({
    email: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
      ]
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern("^(?=.*[a-z]).*$")
      ]
    })
  })

  isSubmitted = false;
  submitError = "";

  constructor(private router: Router, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
  }

  irfgpssw(){
    this.router.navigate(['/fgpssw']);
  }

  async onSubmit() {
    this.isSubmitted = true;
    console.log(this.loginForm.value)

    if (!this.loginForm.valid) {
      console.log("not valid");
      return;
    }

    if (this.loginForm.value.email === this.correo && this.loginForm.value.password === this.clave){
      console.log("valid")
      let navigationExtras: NavigationExtras = {
        state: {
          nombre: this.nombre
        }
      }
      this.router.navigate(['/tabs/tab4'], navigationExtras)
    } else {
      this.loginForm.controls['password'].setErrors({ 'notMatch': true })
    }
  }

  public validation_messages = {
    'email': [
      { type: 'required', message: 'El correo es obligatorio' },
      { type: 'pattern', message: 'El correo no es un correo valido' }
    ],
    'password': [
      { type: 'required', message: 'La contraseña es obligatoria' },
      { type: 'pattern', message: 'La contraseña no es una contraseña valida' },
      { type: 'notMatch', message: 'La contraseña no es correcta' },
    ]
  }
}
