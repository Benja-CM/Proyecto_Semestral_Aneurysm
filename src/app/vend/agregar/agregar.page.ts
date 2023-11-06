import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DbserviceService } from 'src/app/services/dbservice.service';
import { Camera, CameraResultType } from '@capacitor/camera';

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

  catFoto: any = '';

  name: string = "";
  price: string = "";
  stock: string = "";
  descripcion: string = "";
  req_minimo: string = "";
  req_recomendado: string = "";

  categoria: any[] = [
    {
      id: '',
      nombre: '',
    }
  ];

  agregarProdForm = this.formBuilder.group({
    name: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(60),
        Validators.pattern("^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ/*#'’&,.:()+\n-Ⓡ™・]+$")
      ]
    }),
    price: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern("^[0-9]+$")
      ]
    }),
    stock: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern("^[0-9]+$")
      ]
    }),
    descripcion: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(1600),
        Validators.pattern("^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ/*#'’&,.:()+\n-Ⓡ™・]+$")
      ]
    }),
    req_minimo: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(1600),
        Validators.pattern("^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ/*#'’&,.:()+\n-Ⓡ™・]+$")
      ]
    }),
    req_recomendado: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(1600),
        Validators.pattern("^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ/*#'’&,.:()+\n-Ⓡ™・]+$")
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
    })
  })

  isSubmitted = false;

  isAlertOpen = false;
  public alertButtons = ['OK'];

  constructor(private router: Router, private http: HttpClient, private formBuilder: FormBuilder, private db: DbserviceService) { }

  ngOnInit() {
    this.db.buscarCategoria();

    this.db.dbState().subscribe(data => {
      if (data) {
        this.db.fetchCategoria().subscribe(item => {
          this.cate = item;
        })
      }
    });
  }

  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      promptLabelHeader: 'Imagen',
      promptLabelPhoto: 'Seleccionar imagen',
      promptLabelPicture: 'Tomar Foto'
    });

    var imageUrl = image.webPath;

    this.catFoto = imageUrl;
  };

  public async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.uploadFileName = file.name;
    this.uploadFileContent = await file.text();
  }

  async onSubmit() {
    this.isSubmitted = true;
    console.log(this.agregarProdForm.value);
    this.agregarProdForm.get('img')?.setValue(this.catFoto);

    if (this.catFoto === '' || this.catFoto === null) {
      this.agregarProdForm.controls['img'].setErrors({ 'required': true });
      return;
    }

    if (!this.agregarProdForm.valid) {
      console.log("not valid");
      return;
    }

    let nombre = this.agregarProdForm.value.name;
    let precio = this.agregarProdForm.value.price;
    let stock = this.agregarProdForm.value.stock;
    let descripcion = this.agregarProdForm.value.descripcion;
    let req_minimo = this.agregarProdForm.value.req_minimo;
    let req_recomendado = this.agregarProdForm.value.req_recomendado;
    let categorias = this.agregarProdForm.value.categoria;
    let foto = this.catFoto;

    console.log("valid")
    await this.db.agregarProducto(nombre, descripcion, precio, stock, req_minimo, req_recomendado, foto);
    const idProd = await this.db.UltimaIDProducto();

    if (categorias !== null && categorias !== undefined) {
      for (const cat of categorias) {
        await this.db.agregarUnionCP(idProd, cat);
      }
    }
    this.isAlertOpen = true;
  }

  isOpen(state: boolean) {
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
      { type: 'pattern', message: 'El precio debe ser un número entero' },
    ],
    'stock': [
      { type: 'required', message: 'El stock disponible es obligatorio' },
      { type: 'pattern', message: 'El stock disponible debe ser un número entero' },
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