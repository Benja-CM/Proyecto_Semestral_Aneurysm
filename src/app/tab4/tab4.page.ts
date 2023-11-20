import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import type { IonInput } from '@ionic/angular';
import { DbserviceService } from '../services/dbservice.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  isModalOpen: boolean = false;
  inputModel = '';

  nombreR: string = "";

  usuario: any = [];



  isAlertOpenLogin = false;
  public alertButtons1 = ['OK'];

  @ViewChild('ionInputEl', { static: true }) ionInputEl!: IonInput;

  arregloCat: any[] = [
    {
      id: '',
      nombre: '',
    }
  ]

  categoria: string = "";

  categoriaForm = this.formBuilder.group({
    categoria: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern("^[A-Za-z]+$")
      ]
    })
  })

  isSubmitted = false;
  submitError = "";

  isAlertOpen = false;
  public alertButtons = ['OK'];

  userID: any = '';
  id: any = '';
  rol: any = '';

  constructor(private router: Router, private formBuilder: FormBuilder, private activeRouter: ActivatedRoute, private db: DbserviceService) {
    this.activeRouter.queryParams.subscribe(param => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.userID = this.router.getCurrentNavigation()?.extras?.state?.['id'];
        this.rol = this.router.getCurrentNavigation()?.extras?.state?.['rol'];
        this.init(this.userID);
      }
    });
  }

  ngOnInit() {
    this.init1();
  }

  ionViewWillEnter() {
    let usID = localStorage.getItem('usuario')
    this.userID = usID;
    let userRol = localStorage.getItem('rol')
    this.rol = userRol;

    if (this.userID !== '' && this.userID !== null) {
      this.init(this.userID);
    }

  }

  async init1() {
    let usID = localStorage.getItem('usuario')
    this.userID = usID;
    let userRol = localStorage.getItem('rol')
    this.rol = userRol;

    this.db.buscarCategoria();
    this.db.dbState().subscribe(data => {
      if (data) {
        this.db.fetchCategoria().subscribe(item => {
          this.arregloCat = item;
        })
      }
    });
  }

  async init (id:any){
    let usu = await this.db.encontrarUsuarioID(id);
    this.usuario = usu;
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    if (!isOpen) {
      this.isAlertOpen = false;
      this.categoriaForm.controls['categoria'].setValue('');
    }
  }

  async logout() {
    this.isAlertOpenLogin = true;
    this.userID = '';
    localStorage.setItem('usuario', this.nombreR);
  }

  async getUser() {
    let usID = localStorage.getItem('usuario')
    this.db.presentAlert("Error", "Error en la base de datos", "id de usuario: " + this.userID + " o " + this.rol);
  }

  irHistorial() {
    let navigationExtras: NavigationExtras = {
      state: {
        userID: this.userID
      }
    }

    this.router.navigate(['/tabs/tab3'], navigationExtras)
  }

  async onSubmit() {
    this.isSubmitted = true;
    console.log(this.categoriaForm.value)

    if (!this.categoriaForm.valid) {
      console.log("not valid");
      return;
    }

    console.log("valid")
    this.isAlertOpen = true;

    let cat = this.categoriaForm.value.categoria;
    this.db.agregarCategoria(cat);
  }

  public validation_messages = {
    'categoria': [
      { type: 'required', message: 'La categoria es obligatoria' },
      { type: 'minlength', message: 'Debe tener minimo 3 letras' },
      { type: 'pattern', message: 'La categoria no debe tener números ni caracteres especiales' }
    ]
  }
}
