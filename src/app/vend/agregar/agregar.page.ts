import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.page.html',
  styleUrls: ['./agregar.page.scss'],
})
export class AgregarPage implements OnInit {
  @Output() data = new EventEmitter<FormData>();

  public uploadFileName: string = "";
  public uploadFileContent: string = "";

  constructor(private router: Router) { }

  ngOnInit() {
  }



  public async onFileSelected(event: any) {

    const file: File = event.target.files[0];
    this.uploadFileName = file.name;
    this.uploadFileContent = await file.text();

    //get object from json file
    //let obj = JSON.parse(this.uploadFileContent);
  }

  irTab4(){
    // this.presentAlert()
    this.router.navigate(['/tabs/tab4'])
  }

}