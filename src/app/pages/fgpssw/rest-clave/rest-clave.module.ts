import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RestClavePageRoutingModule } from './rest-clave-routing.module';

import { RestClavePage } from './rest-clave.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RestClavePageRoutingModule
  ],
  declarations: [RestClavePage]
})
export class RestClavePageModule {}
