import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  productoRecibido: any = [];

  isAlertOpen = false;
  public alertButtons = ['OK'];

  constructor(private router: Router, private activeRouter: ActivatedRoute) {
    this.activeRouter.queryParams.subscribe(param => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.productoRecibido.push(this.router.getCurrentNavigation()?.extras?.state?.['producto']);
      }
    })
  }

  ngOnInit() {}

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  comprar(){
    this.setOpen(true);
    this.productoRecibido = [];
  }

}
