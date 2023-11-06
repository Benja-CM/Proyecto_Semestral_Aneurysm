import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DbserviceService } from 'src/app/services/dbservice.service';

@Component({
  selector: 'app-agregar-vend',
  templateUrl: './agregar-vend.page.html',
  styleUrls: ['./agregar-vend.page.scss'],
})
export class AgregarVendPage implements OnInit {
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

  public agregarForm = this.formBuilder.group({
    email: new FormControl('', {
      validators: [
        Validators.required,
        Validators.email,
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

  constructor(private router: Router, private formBuilder: FormBuilder, private db: DbserviceService) {
    this.db.buscarPregunta();
  }

  ngOnInit() {
    this.db.dbState().subscribe(data => {
      if (data) {
        this.db.fetchPregunta().subscribe(item => {
          this.arregloPreguntas = item;
        })
      }
    });
  }

  async onSubmit() {
    this.isSubmitted = true;
    console.log(this.agregarForm.value);

    this.claveValida(this.agregarForm.value.password);
    this.confClave(this.agregarForm.value.password, this.agregarForm.value.password_conf);
    this.validarCorreo(this.agregarForm.value.email);

    if (!this.agregarForm.valid) {
      console.log("not valid");
      return;
    }

    console.log("valid");
    let correo = this.agregarForm.value.email;
    let clave = this.agregarForm.value.password;
    let pregunta = this.agregarForm.value.pregunta;
    let respuesta = this.agregarForm.value.resp_secreta;

    this.db.agregarUsuario(correo, clave, respuesta, 2, pregunta, '/assets/icon.png');

    let nuevoUsuario: any = [];
    nuevoUsuario = await this.db.encontrarUsuario(correo);
    this.db.agregarCarrito(nuevoUsuario.id);
    this.db.agregarDireccion(nuevoUsuario.id);
    console.log(nuevoUsuario.id);
    this.router.navigate(['/tabs/tab4'] /* navigationExtras */);
  }

  claveValida(password: any) {
    if (/^(?=.*[A-Z]).*$/.test(password) == false) {
      this.agregarForm.controls['password'].setErrors({ 'errorMayus': true })
    }
    if (/^(?=.*[!@#$&*_+.?~]).*$/.test(password) == false) {
      this.agregarForm.controls['password'].setErrors({ 'errorCarEspecial': true })
    }
    if (/^(?=.*[\d*]).*$/.test(password) == false) {
      this.agregarForm.controls['password'].setErrors({ 'errorNumerico': true })
    }
  }

  confClave(password: any, password_conf: any) {
    if (password !== password_conf) {
      this.agregarForm.controls['password_conf'].setErrors({ 'errorConf': true })
    }
  }

  async validarCorreo(correo:any){
    let email = await this.db.encontrarUsuario(correo);

    if (email !== null) {
      this.agregarForm.controls['email'].setErrors({ 'errorDuplicado': true })
    }
  }

  public validation_messages = {
    'email': [
      { type: 'required', message: 'El correo es obligatorio' },
      { type: 'email', message: 'El correo no es valido' },
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
