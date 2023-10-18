import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { DbserviceService } from 'src/app/services/dbservice.service';

@Component({
  selector: 'app-fgpssw',
  templateUrl: './fgpssw.page.html',
  styleUrls: ['./fgpssw.page.scss'],
})
export class FgpsswPage implements OnInit {
  email: string = "";
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
    pregunta: new FormControl(0, {
      validators: [
        Validators.required,
      ]
    }),
    resp_secreta: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9 ]*$")
      ]
    }),
  })

  isSubmitted = false;
  submitError = "";

  constructor(private router: Router, private formBuilder: FormBuilder, private db: DbserviceService) {
  }

  ngOnInit() {
    this.db.buscarPregunta();
    this.db.dbState().subscribe(data => {
      if (data) {
        this.db.fetchPregunta().subscribe(item => {
          this.arregloPreguntas = item;
        })
      }
    });
  }

  async validaciones() {
    let correo = this.registerForm.value.email;
    const usuario = await this.db.encontrarUsuario(correo);

    if (usuario !== null) {
      let pregunta = this.registerForm.value.pregunta;
      let preg_user = usuario.pregunta.toString();
      
      let respuesta = this.registerForm.value.resp_secreta;
      let resp_user = usuario.respuesta;

      // si pregunta coincide con la pregunta del usuario
      if (preg_user !== pregunta?.toString()) {
        this.registerForm.controls['resp_secreta'].setErrors({ 'notMatch': true });
      }

      // si la respuesta coincide con la respuesta dle usuario
      if (resp_user !== respuesta) {
        this.registerForm.controls['resp_secreta'].setErrors({ 'notMatch': true })
      }

    } else {
      this.registerForm.controls['email'].setErrors({ 'notExist': true })
    }
  }


  async onSubmit() {
    this.isSubmitted = true;
    console.log(this.registerForm.value);
    await this.validaciones();

    if (!this.registerForm.valid) {
      console.log("not valid");
      return;
    }
    let correo = this.registerForm.value.email

    let navigationExtras: NavigationExtras = {
      state: {
        correo: correo,
      }
    }

    console.log("valid");
    this.router.navigate(['/fgpssw/rest-clave'], navigationExtras)
  }

  public validation_messages = {
    'email': [
      { type: 'required', message: 'El correo es obligatorio' },
      { type: 'pattern', message: 'El correo no cumple con el patron' },
      { type: 'notExist', message: 'No existe una cuenta asociada a este correo' },
    ],
    'pregunta': [
      { type: 'required', message: 'La pregunta secreta es obligatoria' },
    ],
    'resp_secreta': [
      { type: 'required', message: 'La respuesta secreta es obligatoria' },
      { type: 'pattern', message: 'La respuesta no debe llevar caracteres especiales' },
      { type: 'notMatch', message: 'La respuesta o la pregunta no son correctas' },
    ]
  }
}
