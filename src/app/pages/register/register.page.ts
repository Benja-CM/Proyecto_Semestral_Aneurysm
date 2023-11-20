import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DbserviceService } from 'src/app/services/dbservice.service';
import { register } from 'swiper/element';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  email: string = "";
  password: string = "";
  pregunta: string = "";
  resp_secreta: string = "";

  arregloPreguntas: any[] = [
    {
      id: '',
      pregunta: ''
    }
  ]

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
    pregunta: new FormControl('', {
      validators: [
        Validators.required
      ]
    }),
    resp_secreta: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30),
        Validators.pattern("^[a-zA-Z0-9 ]*$")
      ]
    })
  })

  isSubmitted = false;
  submitError = "";

  public alertButtons = ['OK'];

  isAlertOpen = false;

  constructor(private router: Router, private formBuilder: FormBuilder, private db: DbserviceService) {
  }

  ngOnInit() {
    this.init();
  }

  async init() {
    this.db.buscarPregunta();
    this.db.dbState().subscribe(data => {
      if (data) {
        this.db.fetchPregunta().subscribe(item => {
          this.arregloPreguntas = item;
        })
      }
    });
  }

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  async onSubmit() {
    this.isSubmitted = true;
    console.log(this.registerForm.value);

    await this.validarCorreo(this.registerForm.value.email);
    await this.claveValida(this.registerForm.value.password);
    await this.confClave(this.registerForm.value.password, this.registerForm.value.password_conf);

    if (!this.registerForm.valid) {
      console.log("not valid");
      return;
    }

    this.setOpen(true);

    console.log("valid");
    let correo = this.registerForm.value.email;
    let clave = this.registerForm.value.password;
    let pregunta = this.registerForm.value.pregunta;
    let respuesta = this.registerForm.value.resp_secreta;

    this.db.agregarUsuario(correo, clave, respuesta, 1, pregunta, '/assets/icon.png');

    let nuevoUsuario: any = [];
    nuevoUsuario = await this.db.encontrarUsuario(correo);
    this.db.agregarCarrito(nuevoUsuario.id);
    this.db.agregarDireccion(nuevoUsuario.id);
    console.log(nuevoUsuario.id);
    this.router.navigate(['/tabs/tab4'] /* navigationExtras */);
  }

  claveValida(password: any) {
    if (/^(?=.*[A-Z]).*$/.test(password) == false) {
      this.registerForm.controls['password'].setErrors({ 'errorMayus': true })
    }
    if (/^(?=.*[!@#$&*_+.?~]).*$/.test(password) == false) {
      this.registerForm.controls['password'].setErrors({ 'errorCarEspecial': true })
    }
    if (/^(?=.*[\d*]).*$/.test(password) == false) {
      this.registerForm.controls['password'].setErrors({ 'errorNumerico': true })
    }
  }

  confClave(password: any, password_conf: any) {
    if (password !== password_conf) {
      this.registerForm.controls['password_conf'].setErrors({ 'errorConf': true })
    }
  }

  async validarCorreo(correo: any) {
    let email = await this.db.encontrarUsuario(correo);

    if (email !== null) {
      this.registerForm.controls['email'].setErrors({ 'errorDuplicado': true })
    }
  }

  public validation_messages = {
    'email': [
      { type: 'required', message: 'El correo es obligatorio' },
      { type: 'pattern', message: 'El correo no cumple con el patron' },
      { type: 'errorDuplicado', message: 'El correo ya esta en uso en otra cuenta' },
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
    'pregunta': [
      { type: 'required', message: 'La pregunta secreta es obligatoria' },
    ],
    'resp_secreta': [
      { type: 'required', message: 'La respuesta secreta es obligatoria' },
      { type: 'pattern', message: 'La respuesta no debe llevar caracteres especiales' }
    ]
  }
}
