import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = "";
  password: string = "";

  public loginForm: FormGroup = new FormGroup({});
  isSubmitted = false;
  submitError = "";

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private alertController: AlertController) 
    {
      this.createForm()
    }

  ngOnInit() {
  }


  createForm(){
    this.loginForm = this.formBuilder.group({
      email: new FormControl('',{validators:[
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
      ]}),
      password: new FormControl('',{validators:[
        Validators.required,
        Validators.pattern("^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$")
      ]})
    })
  }

  async onSubmit(){
    this.isSubmitted = true;
    console.log(this.loginForm.value)

    if(!this.loginForm.valid){
      console.log("not valid");
      return;
    }

    console.log("valid")
  }

  public validation_messages = {
    'email': [
      {type: 'required', message: 'El correo es obligatorio'},
      {type: 'pattern', message: 'El correo no cumple con el patron'}
    ],
    'password': [
      {type: 'required', message: 'La contraseña es obligatoria'},
      {type: 'pattern', message: 'La contraseña debe llevar una mayuscula, una minuscula, un número y un caracter especial'}
    ]
  }
}
