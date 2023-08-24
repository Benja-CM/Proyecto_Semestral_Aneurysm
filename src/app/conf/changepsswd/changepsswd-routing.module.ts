import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangepsswdPage } from './changepsswd.page';

const routes: Routes = [
  {
    path: '',
    component: ChangepsswdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangepsswdPageRoutingModule {}
