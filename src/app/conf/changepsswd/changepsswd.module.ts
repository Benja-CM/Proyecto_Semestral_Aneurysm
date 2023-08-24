import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangepsswdPageRoutingModule } from './changepsswd-routing.module';

import { ChangepsswdPage } from './changepsswd.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangepsswdPageRoutingModule
  ],
  declarations: [ChangepsswdPage]
})
export class ChangepsswdPageModule {}
