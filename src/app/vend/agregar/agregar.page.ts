import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { map } from "rxjs/operators";

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.page.html',
  styleUrls: ['./agregar.page.scss'],
})
export class AgregarPage implements OnInit {
  @Output() data = new EventEmitter<FormData>();

  public uploadFileName: string = "";
  public uploadFileContent: string = "";

  cate: any = [];

  name: string = "";
  price: string = "";
  stock: string = "";
  descripcion: string = "";
  req_minimo: string = "";
  req_recomendado: string = "";
  categoria: any = [];

  isSubmitted = false;
  

  agregarProdForm = this.formBuilder.group({
    name: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(60),
        Validators.pattern("^[A-Za-z ]+$")
      ]
    }),
    price: new FormControl('', {
      validators: [
        Validators.required,
      ]
    }),
    stock: new FormControl('', {
      validators: [
        Validators.required,
      ]
    }),
    descripcion: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(600),
        Validators.pattern("^[A-Za-z ]+$")
      ]
    }),
    req_minimo: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(600),
        Validators.pattern("^[A-Za-z ]+$")
      ]
    }),
    req_recomendado: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(600),
        Validators.pattern("^[A-Za-z ]+$")
      ]
    }),
    categoria: new FormControl('', {
      validators: [
        Validators.required
      ]
    }),
    img: new FormControl('', {
      validators: [
        Validators.required
      ]
    }),
  })

  isAlertOpen = false;
  public alertButtons = ['OK'];

  constructor(
    private router: Router,
    private http: HttpClient,
    private alerta: AlertController,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getCategoria().subscribe(res => {
      console.log("Res", res)
      this.cate = res;
    })
  }

  getCategoria() {
    return this.http
      .get("assets/datos_internos/Categorias.json")
      .pipe(
        map((res: any) => {
          return res.cate;
        })
      )
  }

  public async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.uploadFileName = file.name;
    this.uploadFileContent = await file.text();
  }

  async onSubmit() {
    this.isSubmitted = true;
    console.log(this.agregarProdForm.value)

    if (!this.agregarProdForm.valid) {
      console.log("not valid");
      return;
    }

    console.log("valid")
    this.isAlertOpen = true;
  }

  isOpen(state: boolean){
    if (state === false) {
      this.router.navigate(['/tabs/tab4'])
    }
  }

  public validation_messages = {
    'name': [
      { type: 'required', message: 'El nombre es obligatorio' },
      { type: 'minlength', message: 'El nombre debe tener 10 o más caracteres' },
      { type: 'maxlength', message: 'El nombre debe tener 60 o menos caracteres' },
      { type: 'pattern', message: 'El nombre no debe tener caracteres especiales' },
    ],
    'price': [
      { type: 'required', message: 'El precio es obligatorio' },
    ],
    'stock': [
      { type: 'required', message: 'El stock disponible es obligatorio' },
    ],
    'descripcion': [
      { type: 'required', message: 'La descripción es obligatoria' },
      { type: 'minlength', message: 'La descripción debe tener 10 o más caracteres' },
      { type: 'maxlength', message: 'La descripción debe tener 600 o menos caracteres' },
      { type: 'pattern', message: 'La descripción no debe tener caracteres especiales' },
    ],
    'req_minimo': [
      { type: 'required', message: 'Los requisitos minimos son obligatorios' },
      { type: 'minlength', message: 'Los requisitos minimos debe tener 10 o más caracteres' },
      { type: 'maxlength', message: 'Los requisitos minimos debe tener 600 o menos caracteres' },
      { type: 'pattern', message: 'Los requisitos minimos no debe tener caracteres especiales' },
    ],
    'req_recomendado': [
      { type: 'required', message: 'Los requisitos recomendados son obligatorios' },
      { type: 'minlength', message: 'Los requisitos recomendados debe tener 10 o más caracteres' },
      { type: 'maxlength', message: 'Los requisitos recomendados debe tener 600 o menos caracteres' },
      { type: 'pattern', message: 'Los requisitos recomendados no debe tener caracteres especiales' },
    ],
    'categoria': [
      { type: 'required', message: 'Ingresar al menos una categoria' }
    ],
    'img': [
      { type: 'required', message: 'La imagen es obligatoria' }
    ],
  }
}