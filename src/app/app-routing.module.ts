import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./conf/user/user.module').then( m => m.UserPageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./not-found/not-found.module').then( m => m.NotFoundPageModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./conf/user/user.module').then( m => m.UserPageModule)
  },  {
    path: 'record',
    loadChildren: () => import('./conf/record/record.module').then( m => m.RecordPageModule)
  },
  {
    path: 'changepsswd',
    loadChildren: () => import('./conf/changepsswd/changepsswd.module').then( m => m.ChangepsswdPageModule)
  }




];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
