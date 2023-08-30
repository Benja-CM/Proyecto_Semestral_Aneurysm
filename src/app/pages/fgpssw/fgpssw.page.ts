import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fgpssw',
  templateUrl: './fgpssw.page.html',
  styleUrls: ['./fgpssw.page.scss'],
})
export class FgpsswPage implements OnInit {
  email: string = "";
  resp_secreta: string = "";

  public registerForm = this.formBuilder.group({
    email: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
      ]
    }),
    resp_secreta: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9 ]*$")
      ]
    })
  })

  isSubmitted = false;
  submitError = "";
  
  constructor(private router: Router,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
  }


  async onSubmit() {
    this.isSubmitted = true;
    console.log(this.registerForm.value);

    if (!this.registerForm.valid) {
      console.log("not valid");
      return;
    }

    console.log("valid");
    this.router.navigate(['/tabs/tab4'] /* navigationExtras */)
  }

  public validation_messages = {
    'email': [
      { type: 'required', message: 'El correo es obligatorio' },
      { type: 'pattern', message: 'El correo no cumple con el patron' }
    ],
    'resp_secreta': [
      { type: 'required', message: 'La respuesta secreta es obligatoria' },
      { type: 'pattern', message: 'La respuesta no debe llevar caracteres especiales' }
    ]
  }
}
