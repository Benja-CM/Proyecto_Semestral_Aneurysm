import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Tab2viewPageRoutingModule } from './tab2view-routing.module';

import { Tab2viewPage } from './tab2view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab2viewPageRoutingModule
  ],
  declarations: [Tab2viewPage]
})
export class Tab2viewPageModule {}