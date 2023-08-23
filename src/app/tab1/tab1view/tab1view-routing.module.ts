import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tab1viewPage } from './tab1view.page';

const routes: Routes = [
  {
    path: '',
    component: Tab1viewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab1viewPageRoutingModule {}
