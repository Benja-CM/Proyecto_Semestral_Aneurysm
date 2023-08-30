import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangepsswdPageRoutingModule } from './changepsswd-routing.module';

import { ChangepsswdPage } from './changepsswd.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ChangepsswdPageRoutingModule
  ],
  declarations: [ChangepsswdPage]
})
export class ChangepsswdPageModule {}
