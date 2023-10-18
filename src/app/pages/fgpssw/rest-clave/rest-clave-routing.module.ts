import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestClavePage } from './rest-clave.page';

const routes: Routes = [
  {
    path: '',
    component: RestClavePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestClavePageRoutingModule {}
