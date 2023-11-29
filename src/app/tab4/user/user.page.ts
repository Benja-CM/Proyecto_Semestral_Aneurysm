import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { DbserviceService } from 'src/app/services/dbservice.service';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  catFoto: any = ""

  name: string = "";
  surname: string = "";
  email: string = "";
  tfn: number = 0;
  rut: number = 0;
  dvrut: string = "";
  str: string = "";
  number: number = 0;
  region: string = "";
  comun: string = "";
  cod: number = 0;

  letra: string = "";

  isSubmitted = false;

  usuario: any = [];

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
    tfn: new FormControl(0, {
      validators: [
        Validators.required,
        Validators.maxLength(9),
      ]
    }),
    rut: new FormControl(0, {
      validators: [
        Validators.required,
        Validators.maxLength(8),
      ]
    }),
    dvrut: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern("^[0-9kK]+$")
      ]
    }),
    str: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern("^[A-Za-z ]+$")
      ]
    }),
    number: new FormControl(0, {
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
    cod: new FormControl(0, {
      validators: [
        Validators.required,
        Validators.maxLength(7),
        Validators.pattern("^[0-9]+$")
      ]
    }),
  })

  calleRec: any = null;
  numeroRec: any;
  codpostalRec: any;
  regionRec: any;
  comunaRec: any;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private db: DbserviceService,
    private activeRouter: ActivatedRoute
  ) {
    
  }

  ngOnInit() {
    this.init();
  }

  ionViewWillEnter() {
    this.activeRouter.queryParams.subscribe(param => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.calleRec = this.router.getCurrentNavigation()?.extras?.state?.['calle'];
        this.numeroRec = this.router.getCurrentNavigation()?.extras?.state?.['numero'];
        this.codpostalRec = this.router.getCurrentNavigation()?.extras?.state?.['cod_postal'];
        console.log(this.router.getCurrentNavigation()?.extras?.state?.['cod_postal'])
        this.regionRec = this.router.getCurrentNavigation()?.extras?.state?.['region'];
        this.comunaRec = this.router.getCurrentNavigation()?.extras?.state?.['comuna'];
      }
    });
    console.log(this.calleRec, this.numeroRec, this.codpostalRec, this.regionRec, this.comunaRec)

    if (this.calleRec !== null) {
      console.log("pasa direccion");
      this.userForm.patchValue({
        str: this.calleRec,
        number: this.numeroRec,
        region: this.regionRec,
        comun: this.comunaRec,
        cod: this.codpostalRec,
      })
    }
  }

  async init() {
    
    this.db.buscarUsuario();
    this.db.buscarDireccion();

    let userID = localStorage.getItem('usuario');
    const usuario = await this.db.encontrarUsuarioID(userID);
    this.usuario = usuario;
    const direccion = await this.db.encontrarDireccionPorID(userID);

    if (usuario === null) {
      this.db.presentAlert("Error", "Error en la base de datos", "Error al buscar el usuario");
      this.router.navigate(['/tabs/tab4'])
      return;
    }

    if (direccion === null) {
      this.db.presentAlert("Error", "Error en la base de datos", "Error al buscar la dirección");
      return;
    }

    this.catFoto = usuario.foto;

    this.userForm.patchValue({
      name: usuario.nombre,
      surname: usuario.apellido,
      tfn: usuario.telefono,
      rut: usuario.rut,
      dvrut: usuario.dvrut,
    });

    if (this.calleRec === null) {
      console.log("no pasa direccion");
      this.userForm.patchValue({
        str: direccion.calle,
        number: direccion.numero,
        region: direccion.region,
        comun: direccion.comuna,
        cod: direccion.cod_postal,
      });
    } 
  }

  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      promptLabelHeader: 'Imagen',
      promptLabelPhoto: 'Seleccionar imagen',
      promptLabelPicture: 'Tomar Foto',
      width: 400,
      height: 400,
    });

    var imageUrl = image.webPath;

    this.catFoto = imageUrl;
  };

  async irDireccion() {
    this.router.navigate(['/user/direccion'])
  }

  onTab4Init() {
    console.log("onTab4Init");
    this.init();
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
    this.rutValido(this.userForm.value.rut);


    let name = this.userForm.value.name;
    let surname = this.userForm.value.surname;
    let email = this.usuario.correo;
    let rut = this.userForm.value.rut;
    let dvrut = this.userForm.value.dvrut;
    let tfn = this.userForm.value.tfn;

    let calle = this.userForm.value.str;
    let numero = this.userForm.value.number;
    let comuna = this.userForm.value.comun;
    let region = this.userForm.value.region;
    let cod_postal = this.userForm.value.cod;
    let foto = this.catFoto;

    console.log(name + ', ' + surname + ', ' + email + ', ' + rut + ', ' + dvrut + ', ' + tfn);
    console.log(calle + ', ' + numero + ', ' + comuna + ', ' + region + ', ' + cod_postal);

    if (!this.userForm.valid) {
      console.log("not valid");
      return;
    }

    let userID = localStorage.getItem('usuario');

    this.db.actualizarUsuario(userID, rut, dvrut, name, surname, tfn, foto);
    this.db.actualizarDireccion(calle, numero, cod_postal, region, comuna, userID);
    console.log("valid");
    this.db.presentAlert("Guardado exitoso", "", "Se ha guardado exitosamente la información personal");

    this.router.navigate(['/tabs/tab4']);
  }

  /* Validar Nombre*/
  nombreValido(name: any) {
    this.letra = name.charAt(0);
    console.log("validacion nombre");
    if (!esMayuscula(this.letra)) {
      console.log("error nombre");
      this.userForm.controls['name'].setErrors({ 'errorMayus': true });
    }
  }


  /* Validar Apellido */
  apellidoValido(surname: any) {
    console.log("validación Apellido");
    /* if (!validarNombre(surname)) {
      this.userForm.controls['surname'].setErrors({ 'errorNumero': true });
      console.log("error Apellido1");
    } */

    var letra = surname.charAt(0);
    if (!esMayuscula(letra)) {
      this.userForm.controls['surname'].setErrors({ 'errorMayus': true });
      console.log("error Apellido2");
    }
  }

  /* Validar Telefono*/
  telefonoValido(tlf: any) {
    if (tlf.toString().length != 9) {
      this.userForm.controls['tfn'].setErrors({ 'errorLargo': true });
    }
  }

  /* Validar rut */
  rutValido(rut: any) {
    if (rut.toString().length != 8) {
      this.userForm.controls['rut'].setErrors({ 'errorLargo': true });
    }
  }

  //////// Validar dirección ///////////
  /* Validar Calle */
  calleValida(calle: any) {
    console.log("validacion direccion");
    var letra = calle.charAt(0);
    if (!esMayuscula(letra)) {
      console.log("error direccion");
      this.userForm.controls['str'].setErrors({ 'errorMayus': true });
    }
  }

  /* Validar Region y Comuna */
  regionValida(region: any) {
    console.log("validacion region");
    if (region === 'sin-region') {
      console.log("error region");
      this.userForm.controls['region'].setErrors({ 'errorNull': true });
    }
  }

  comunaValida(comun: any) {
    console.log("validacion comuna");
    if (comun === 'sin-comuna') {
      console.log("error comuna");
      this.userForm.controls['comun'].setErrors({ 'errorNull': true });
    }
  }


  public validation_messages = {
    'name': [
      { type: 'required', message: 'El nombre es obligatorio' },
      { type: 'minlength', message: 'El nombre debe tene minimo 3 números' },
      { type: 'pattern', message: 'El nombre no debe tener caracteres especiales' },
      { type: 'errorMayus', message: 'La primera letra del nombre debe ser mayúscula' }
    ],
    'surname': [
      { type: 'required', message: 'El apellido es obligatoria' },
      { type: 'minlength', message: 'El apellido debe tene minimo 3 números' },
      { type: 'pattern', message: 'El apellido no debe tener caracteres especiales' },
      /* { type: 'errorNumero', message: 'El apellido no debe contener números' }, */
      { type: 'errorMayus', message: 'La primera letra del apellido debe ser mayúscula' }
    ],
    'email': [
      { type: 'required', message: 'El correo es obligatoria' },
      { type: 'email', message: 'El correo no es correcto' }
    ],
    'tfn': [
      { type: 'required', message: 'El telefono es obligatoria' },
      { type: 'errorLargo', message: 'El telefono debe tene 9 números' }

    ],
    'rut': [
      { type: 'required', message: 'El rut es obligatorio' },
      { type: 'errorLargo', message: 'El rut debe tener 8 números' }
    ],
    'dvrut': [
      { type: 'required', message: 'El digito verificador es obligatorio' },
      { type: 'pattern', message: 'El digito verificador debe ser un número o la letra "K"' }
    ],
    'str': [
      { type: 'required', message: 'El nombre de la calle es obligatorio' },
      { type: 'pattern', message: 'La calle no puede tener caracteres especiales' },
      { type: 'required', message: 'La primera letra de la calle debe ser mayúscula' }
    ],
    'number': [
      { type: 'required', message: 'El número del domicilio es oblicatorio' },
      { type: 'minlength', message: 'La dirección debe tener 1 o más números' },
      { type: 'maxlength', message: 'La dirección debe tener 4 o menos números' }
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
      { type: 'maxlength', message: 'El codigo postal solo debe tener 7 números' },
      { type: 'pattern', message: 'El codigo postal solo debe tener números' }
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
/* 
function validarNombre(name: string) {
  var regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/; // expresión regular que permite solo letras, espacios y tildes
  if (!regex.test(name)) {
    return false; // si el nombre contiene algún número u otro carácter no permitido, la validación falla
  }
  return true; // si el nombre es válido, la validación es exitosa
} */