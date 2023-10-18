import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FgpsswPage } from './fgpssw.page';

const routes: Routes = [
  {
    path: '',
    component: FgpsswPage
  },  {
    path: 'rest-clave',
    loadChildren: () => import('./rest-clave/rest-clave.module').then( m => m.RestClavePageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FgpsswPageRoutingModule {}
