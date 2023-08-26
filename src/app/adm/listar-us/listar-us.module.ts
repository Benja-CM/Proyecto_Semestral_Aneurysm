import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListarUsPageRoutingModule } from './listar-us-routing.module';

import { ListarUsPage } from './listar-us.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListarUsPageRoutingModule
  ],
  declarations: [ListarUsPage]
})
export class ListarUsPageModule {}
