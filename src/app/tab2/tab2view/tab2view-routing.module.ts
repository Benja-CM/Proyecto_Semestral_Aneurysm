import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tab2viewPage } from './tab2view.page';

const routes: Routes = [
  {
    path: '',
    component: Tab2viewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab2viewPageRoutingModule {}
