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

  constructor(
    private router: Router, private formBuilder: FormBuilder, private activeRouter: ActivatedRoute, private db: DbserviceService) {
    this.activeRouter.queryParams.subscribe(param => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.nombreR = this.router.getCurrentNavigation()?.extras?.state?.['nombre'];
      }
    });
  }

  ngOnInit() {
    this.db.buscarCategoria();

    this.db.dbState().subscribe(data => {
      if (data) {
        this.db.fetchCategoria().subscribe(item => {
          this.arregloCat = item;
        })
      }
    });
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    if (!isOpen) {
      this.isAlertOpen = false;
      this.categoriaForm.controls['categoria'].setValue('');
    }
  }

  logout() {
    this.isAlertOpenLogin = true;
    this.nombreR = "";
  }

  async getUser() {
    const id = await this.db.get('id');
    this.db.presentAlert("id de usuario: "+id);
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
