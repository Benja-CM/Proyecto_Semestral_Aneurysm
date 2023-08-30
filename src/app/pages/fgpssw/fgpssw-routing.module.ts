import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FgpsswPage } from './fgpssw.page';

const routes: Routes = [
  {
    path: '',
    component: FgpsswPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FgpsswPageRoutingModule {}
