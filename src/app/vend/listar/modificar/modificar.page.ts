import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DbserviceService } from 'src/app/services/dbservice.service';

@Component({
  selector: 'app-modificar',
  templateUrl: './modificar.page.html',
  styleUrls: ['./modificar.page.scss'],
})
export class ModificarPage implements OnInit {

  name: string = "";
  price: number = 0;
  stock: number = 0;
  descripcion: string = "";
  req_minimo: string = "";
  req_recomendado: string = "";
  categoria: any = [];
  img: string = "";


  modificarProdForm = this.formBuilder.group({
    name: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(60),
        Validators.pattern("^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ/*#'’-Ⓡ™]+$")
      ]
    }),
    price: new FormControl(0, {
      validators: [
        Validators.required,
        Validators.pattern("^[0-9]+$")
      ]
    }),
    stock: new FormControl(0, {
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
        Validators.pattern("^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ/*#'’&,.:()+\n-Ⓡ™]+$")
      ]
    }),
    req_minimo: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(1600),
        Validators.pattern("^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ/*#'’&,.:()+\n-Ⓡ™]+$")
      ]
    }),
    req_recomendado: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(1600),
        Validators.pattern("^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ/*#'’&,.:()+\n-Ⓡ™]+$")
      ]
    }),
    categoria: new FormControl({}, {
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

  isSubmitted = false;

  productoFilter: any = [];

  idRecibida: number = 0;

  arregloCategorias: any = [];
  categorias: any = [];
  categoriasFilter: any = [];

  categoriasSeleccionadas: number[] = [];

  constructor(private formBuilder: FormBuilder, private activeRouter: ActivatedRoute, private db: DbserviceService, private router: Router, private http: HttpClient,) {
    this.activeRouter.queryParams.subscribe(param => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.idRecibida = this.router.getCurrentNavigation()?.extras?.state?.['id'];
      }
    })
  }

  ngOnInit() {
    this.getUnion();
    this.init(this.idRecibida);
  }

  async init(id: number) {
    const producto = await this.db.encontrarProducto(id);

    const categorias = await this.db.encontrarUnionPorProducto(id);

    if (producto === null) {
      this.db.presentAlert("Error", "Error en la base de datos", "Error al buscar el producto");
      return;
    }

    if (categorias === null) {
      this.db.presentAlert("Error", "Error en la base de datos", "Error al buscar la categorias");
      return;
    }

    await this.db.buscarCategoria();
    await this.db.dbState().subscribe(data => {
      if (data) {
        this.db.fetchCategoria().subscribe(item => {
          this.arregloCategorias = item;
        })
      }
    });

    this.productoFilter = producto;

    if (producto) {
      this.modificarProdForm.patchValue({
        name: producto.nombre,
        price: producto.precio,
        stock: producto.stock,
        descripcion: producto.descripcion,
        req_minimo: producto.req_minimo,
        req_recomendado: producto.req_recomendado,
        categoria: null,
        img: producto.foto,
      });
    } else {
      console.error('Producto no encontrado.');
    }
    console.log(producto);
  }

  async getUnion() {
    this.categoriasFilter = [];
    console.log("GetUnion");
    const categorias = await this.db.encontrarUnionPorProducto(this.idRecibida);

    if (categorias !== null) {
      for (const categoria of categorias) {
        const categoriaDetalle = await this.db.encontrarCategoria(categoria.categoria);
        if (categoriaDetalle !== null) {
          await this.categoriasFilter.push(categoriaDetalle);
          await this.categoriasSeleccionadas.push(categoriaDetalle.id);
          await console.log("categoriasFilter: ", this.categoriasFilter);
          await console.log("categoriasSeleccionadas ", this.categoriasSeleccionadas);
        }
      }

    }
    if (this.categoriasSeleccionadas !== null) {

      this.modificarProdForm.get('categoria')?.setValue(this.categoriasSeleccionadas);
      this.modificarProdForm.get('categoria')?.setValue(11);
    }
  }

  async onSubmit() {
    this.isSubmitted = true;
    console.log(this.modificarProdForm.value)

    this.categorias = this.modificarProdForm.value.categoria;
    console.log("llolol "+this.categorias);

    if (!this.modificarProdForm.valid) {
      console.log("not valid");
      return;
    }

    console.log("valid");
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
