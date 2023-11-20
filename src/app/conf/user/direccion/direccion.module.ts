import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DireccionPageRoutingModule } from './direccion-routing.module';

import { DireccionPage } from './direccion.page';
import { GooglemapsComponent } from 'src/app/components/googlemaps/googlemaps.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DireccionPageRoutingModule
  ],
  declarations: [DireccionPage, GooglemapsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DireccionPageModule {}
