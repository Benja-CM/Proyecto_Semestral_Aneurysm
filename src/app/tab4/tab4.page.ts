import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel'
    },
    {
      text: 'OK',
      role: 'confirm'
    },
  ];
  public alertInputs = [
    {
      placeholder: 'Nombre de la categoria',
    },
  ];

  roleMessage = '';

constructor() { }

ngOnInit() {
}

}
