import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ActionSheetController, AlertController, IonModal, ModalController } from '@ionic/angular';
import { map } from "rxjs/operators";
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.page.html',
  styleUrls: ['./listar.page.scss'],
})
export class ListarPage implements OnInit {
  presentingElement: any = undefined;

  isModalOpen = false;

  cate: any = [];

  Productos: any = [];
  id: number = 0;
  producto: any = {};

  name: string = "";
  price: string = "";
  stock: string = "";
  descripcion: string = "";
  req_minimo: string = "";
  req_recomendado: string = "";
  categoria: any = [];

  isSubmitted = false;

  modificarProdForm = this.formBuilder.group({
    name: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(60),
        Validators.pattern("^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ/*#'’-]+$")
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
        Validators.pattern("^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ/*#'’&,.:()+\n-]+$")
      ]
    }),
    req_minimo: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(600),
        Validators.pattern("^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ/*#'’&,.:()+\n-]+$")
      ]
    }),
    req_recomendado: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(600),
        Validators.pattern("^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ/*#'’&,.:()+\n-]+$")
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
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private alerta: AlertController,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getProductos().subscribe(res => {
      console.log("Res", res)
      this.Productos = res;
    })
    this.presentingElement = document.querySelector('.ion-page');
    this.getCategoria().subscribe(res => {
      console.log("Res", res)
      this.cate = res;
    });
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

  canDismiss = async () => {
    if (this.isModalOpen === true) {
      const actionSheet = await this.actionSheetCtrl.create({
        header: '¿Estas Seguro?',
        buttons: [
          {
            text: 'Sí',
            role: 'confirm',

          },
          {
            text: 'No',
            role: 'cancel',
          },
        ],
      });

      actionSheet.present();

      const { role } = await actionSheet.onWillDismiss();

      this.openModal(false, 1);
      return role === 'confirm';
    } else {
      return null;
    }
  };

  openModal(isOpen: boolean, id: number) {
    this.isModalOpen = isOpen;
    this.getProducto(id).subscribe(producto => {
      if (producto) {
        this.producto = producto;
    
        this.modificarProdForm.setValue({
          name: this.producto.name,
          price: this.producto.price,
          stock: this.producto.stock,
          descripcion: this.producto.descripcion,
          req_minimo: this.producto.req_minimo,
          req_recomendado: this.producto.req_recomendado,
          categoria: this.producto.categorias,
          img: null
        });
      } else {
        console.error('Producto no encontrado.');
      }
    });
    console.log(this.producto);
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(null, 'confirm');
  }

  getProductos() {
    return this.http
      .get("assets/datos_internos/productos.json")
      .pipe(
        map((res: any) => {
          return res.data;
        })
      )
  }

  getProducto(id: number) {
    return this.http.get("assets/datos_internos/productos.json")
      .pipe(
        map((res: any) => {
          const productos = res.data;
          const productoEncontrado = productos.find((producto: any) => producto.id === id);
          return productoEncontrado;
        })
      );
  }

  getId(productoId: number) {
    for (const producto of this.Productos) {
      if (producto.id === productoId) {
        return productoId;
      }
    }
    return null; // Manejo para cuando no se encuentra la ID
  }

  showProducto(productoId: number) {
    const idEncontrada = this.getId(productoId);
    let navigationExtras: NavigationExtras = {
      state: {
        id: idEncontrada
      }
    }
    console.log(idEncontrada)
    this.router.navigate(['/tabs/tab1/tab1view'], navigationExtras)
  }

  async onSubmit() {
    this.isSubmitted = true;
    console.log(this.modificarProdForm.value)

    if (!this.modificarProdForm.valid) {
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
