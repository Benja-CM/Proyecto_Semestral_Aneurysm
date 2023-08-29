import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  name: string = "";
  surname: string = "";
  email: string = "";
  tfn: number = 0;
  str: string = "";
  number: number = 0;
  region: string = "";
  comun: string = "";
  cod: number = 0;

  
  public userForm: FormGroup = new FormGroup({});
  isSubmitted = false;
  submitError = "";

  @Output() data = new EventEmitter<FormData>();

  public uploadFileName: string = "";
  public uploadFileContent: string = "";

  constructor(
    private router: Router,
    private formBuilder: FormBuilder) {
    this.createForm()
  }

  ngOnInit() {
  }

  createForm() {
    this.userForm = this.formBuilder.group({
      name: new FormControl('', {
        validators: [
          Validators.required,
          Validators.pattern("^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\\s]+$")
        ]
      }),
    })
  }

  async onSubmit() {
    this.isSubmitted = true;
    console.log(this.userForm.value)

    if (!this.userForm.valid) {
      console.log("not valid");
      return;
    }

    console.log("valid")
    this.router.navigate(['/tabs/tab4'] /* navigationExtras */)
  }

  public validation_messages = {
    'name': [
      { type: 'required', message: 'El nombre es obligatorio' },
      { type: 'pattern', message: 'El nombre no es valido' }
    ],
  }

  public async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.uploadFileName = file.name;
    this.uploadFileContent = await file.text();
  }

}
