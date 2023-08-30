import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./conf/user/user.module').then(m => m.UserPageModule)
  },
  {
    path: 'record',
    loadChildren: () => import('./conf/record/record.module').then(m => m.RecordPageModule)
  },
  {
    path: 'changepsswd',
    loadChildren: () => import('./conf/changepsswd/changepsswd.module').then(m => m.ChangepsswdPageModule)
  },
  {
    path: 'agregar',
    loadChildren: () => import('./vend/agregar/agregar.module').then( m => m.AgregarPageModule)
  },
  {
    path: 'listar',
    loadChildren: () => import('./vend/listar/listar.module').then( m => m.ListarPageModule)
  },
  {
    path: 'agregar-vend',
    loadChildren: () => import('./adm/agregar-vend/agregar-vend.module').then( m => m.AgregarVendPageModule)
  },
  {
    path: 'listar-us',
    loadChildren: () => import('./adm/listar-us/listar-us.module').then( m => m.ListarUsPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'fgpssw',
    loadChildren: () => import('./pages/fgpssw/fgpssw.module').then( m => m.FgpsswPageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundPageModule)
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
