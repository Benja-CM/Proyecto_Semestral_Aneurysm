import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  email: string = "";
  password: string = "";

  public registerForm: FormGroup = new FormGroup({});
  isSubmitted = false;
  submitError = "";

  constructor(private router: Router,
    private formBuilder: FormBuilder) {
    this.createForm()
  }

  ngOnInit() {
  }

  createForm() {
    this.registerForm = this.formBuilder.group({
      email: new FormControl('', {
        validators: [
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
        ]
      }),
      password: new FormControl('', {
        validators: [
          Validators.required,
          Validators.pattern("^[a-zA-Z]{8}$")
        ]
      })
    })
  }

  async onSubmit() {
    this.isSubmitted = true;
    console.log(this.registerForm.value)

    if (!this.registerForm.valid) {
      console.log("not valid");
      return;
    }

    console.log("valid")
    this.router.navigate(['/tabs/tab4'] /* navigationExtras */)
  }

  public validation_messages = {
    'email': [
      { type: 'required', message: 'El correo es obligatorio' },
      { type: 'pattern', message: 'El correo no cumple con el patron' }
    ],
    'password': [
      { type: 'required', message: 'La contraseña es obligatoria' },
      { type: 'pattern', message: 'La contraseña debe llevar una mayuscula, una minuscula, un número y un caracter especial' }
    ]
  }
}
