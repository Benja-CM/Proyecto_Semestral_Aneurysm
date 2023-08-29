import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import type { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  isModalOpen: boolean = false;
  inputModel = '';

  @ViewChild('ionInputEl', { static: true }) ionInputEl!: IonInput;

  categoria: string = "";

  isAlertOpen = false;
  public alertButtons = ['OK'];

  public categoriaForm: FormGroup;
  isSubmitted = false;
  submitError = "";

  constructor(
    private router: Router,
    private formBuilder: FormBuilder) {
    this.categoriaForm = this.formBuilder.group({
      categoria: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern("^[A-Za-z]+$")
        ]
      })
    })
  }

  ngOnInit() {
  }

  onInput(ev: { target: any; }) {
    const value = ev.target!.value;
    const filteredValue = value.replace(/[^A-Za-z]+/g, '');
    this.ionInputEl.value = this.inputModel = filteredValue;
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    if (!isOpen) {
      this.isAlertOpen = false;
      this.categoriaForm.controls['categoria'].setValue('');
    }
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
  }

  public validation_messages = {
    'categoria': [
      { type: 'required', message: 'La categoria es obligatoria' },
      { type: 'minlength', message: 'Debe tener minimo 3 letras' },
      { type: 'pattern', message: 'La categoria no debe tener números ni caracteres especiales' }
    ]
  }
}
