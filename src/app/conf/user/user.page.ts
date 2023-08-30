import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  name: string = "";
  surname: string = "";
  email: string = "";
  tfn: string = "";
  str: string = "";
  number: string = "";
  region: string = "";
  comun: string = "";
  cod: string = "";

  letra: string = "";

  isSubmitted = false;

  public uploadFileName: string = "";
  public uploadFileContent: string = "";

  userForm = this.formBuilder.group({
    name: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern("^[A-Za-z]+$")
      ]
    }),
    surname: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern("^[A-Za-z]+$")
      ]
    }),
    email: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
      ]
    }),
    tfn: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(9),
      ]
    }),
    str: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern("^[A-Za-z]+$")
      ]
    }),
    number: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(4),
      ]
    }),
    region: new FormControl('', {
      validators: [
        Validators.required
      ]
    }),
    comun: new FormControl('', {
      validators: [
        Validators.required
      ]
    }),
    cod: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern("^\d{7}$")
      ]
    }),
  })

  constructor(
    private router: Router,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
  }

  public async onFileSelected(event: any) {
    const file: File = event.target.files(0);
    this.uploadFileName = file.name;
    this.uploadFileContent = await file.text();
  }

  async onSubmit() {
    this.isSubmitted = true;
    console.log(this.userForm.value)

    this.nombreValido(this.userForm.value.name);
    this.apellidoValido(this.userForm.value.surname);
    this.telefonoValido(this.userForm.value.tfn);
    this.calleValida(this.userForm.value.str);
    this.regionValida(this.userForm.value.region);
    this.comunaValida(this.userForm.value.comun);

    if (!this.userForm.valid) {
      console.log("not valid");
      return;
    }

    console.log("valid")
  }

  /* Validar Nombre*/
  nombreValido(name: any) {
    this.letra = name.charAt(0);
    if (!esMayuscula(this.letra)) {
      this.userForm.controls['name'].setErrors({ 'errorMayus': true });
    }
  }


  /* Validar Apellido */
  apellidoValido(surname: any) {
    if (!validarNombre(surname)) {
      this.userForm.controls['surname'].setErrors({ 'errorNumero': true });
    }

    var letra = surname.charAt(0);
    if (!esMayuscula(letra)) {
      this.userForm.controls['surname'].setErrors({ 'errorMayus': true });
    }
  }

  /* Validar Telefono*/
  telefonoValido(tfn: any) {
    if (/^[0-9+ ]+$/.test(tfn) == false) {
      this.userForm.controls['tfn'].setErrors({ 'errorPatron': true });
    }
  }

  //////// Validar dirección ///////////
  /* Validar Calle */
  calleValida(calle: any) {
    var letra = calle.charAt(0);
    if (!esMayuscula(letra)) {
      this.userForm.controls['str'].setErrors({ 'errorMayus': true });
    }
  }

  /* Validar Region y Comuna */
  regionValida(region: any) {
    if (region === 'sin-region') {
      this.userForm.controls['region'].setErrors({ 'errorNull': true });
    }
  }

  comunaValida(comun: any) {
    if (comun === 'sin-comuna') {
      this.userForm.controls['str'].setErrors({ 'errorNull': true });
    }
  }


  public validation_messages = {
    'name': [
      { type: 'required', message: 'El nombre es obligatorio' },
      { type: 'pattern', message: 'El nombre no debe tener caracteres especiales' },
      { type: 'errorMayus', message: 'La primera letra del nombre debe ser mayúscula' }
    ],
    'surname': [
      { type: 'required', message: 'El apellido es obligatoria' },
      { type: 'pattern', message: 'El apellido no debe tener caracteres especiales' },
      { type: 'errorNumero', message: 'El apellido no debe contener números' },
      { type: 'errorMayus', message: 'La primera letra del apellido debe ser mayúscula' },
    ],
    'email': [
      { type: 'required', message: 'El correo es obligatoria' },
      { type: 'pattern', message: 'El correo no es correcto' }
    ],
    'tfn': [
      { type: 'required', message: 'El telefono es obligatoria' },
      { type: 'minlength', message: 'El telefono debe tene minimo 9 números' },
      { type: 'errorPatron', message: 'El teléfono solo debe contener números, espacios y el signo +' },
    ],
    'str': [
      { type: 'required', message: 'El nombre de la calle es obligatorio' },
      { type: 'pattern', message: 'La calle no puede tener caracteres especiales' },
      { type: 'required', message: 'La primera letra de la calle debe ser mayúscula' },
    ],
    'number': [
      { type: 'required', message: 'El número del domicilio es oblicatorio' },
      { type: 'minlength', message: 'La dirección debe tener 1 o más números' },
      { type: 'maxlength', message: 'La dirección debe tener 4 o menos números' },
    ],
    'region': [
      { type: 'required', message: 'La region es obligatoria' },
      { type: 'errorNull', message: 'Debe seleccionar una región' }
    ],
    'comun': [
      { type: 'required', message: 'La comuna es obligatoria' },
      { type: 'errorNull', message: 'Debe seleccionar una comuna' }
    ],
    'cod': [
      { type: 'required', message: 'El codigo postal es obligatorio' },
      { type: 'pattern', message: 'El codigo postal solo debe tener 7 números' }
    ]
  }
}

function esMayuscula(letra: string) {
  console.log(letra);
  console.log(letra.toUpperCase());
  if (letra === letra.toUpperCase()) {
    return true;
  }
  else {
    return false;
  }

}

function validarNombre(name: string) {
  var regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/; // expresión regular que permite solo letras, espacios y tildes
  if (!regex.test(name)) {
    return false; // si el nombre contiene algún número u otro carácter no permitido, la validación falla
  }
  return true; // si el nombre es válido, la validación es exitosa
}