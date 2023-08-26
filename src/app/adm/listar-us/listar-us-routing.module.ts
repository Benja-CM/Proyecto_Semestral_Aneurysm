import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListarUsPage } from './listar-us.page';

const routes: Routes = [
  {
    path: '',
    component: ListarUsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarUsPageRoutingModule {}
