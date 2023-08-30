import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarVendPageRoutingModule } from './agregar-vend-routing.module';

import { AgregarVendPage } from './agregar-vend.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarVendPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AgregarVendPage]
})
export class AgregarVendPageModule {}
