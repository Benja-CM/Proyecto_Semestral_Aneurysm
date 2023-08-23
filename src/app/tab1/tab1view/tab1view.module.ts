import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Tab1viewPageRoutingModule } from './tab1view-routing.module';

import { Tab1viewPage } from './tab1view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab1viewPageRoutingModule
  ],
  declarations: [Tab1viewPage]
})
export class Tab1viewPageModule {}
