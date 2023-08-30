import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FgpsswPageRoutingModule } from './fgpssw-routing.module';

import { FgpsswPage } from './fgpssw.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FgpsswPageRoutingModule
  ],
  declarations: [FgpsswPage]
})
export class FgpsswPageModule {}
