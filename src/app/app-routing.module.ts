import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './pages/layout';
const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: './pages/home/home.module#HomeModule',
      },
      {
        path: 'buy-gzr',
        loadChildren: './pages/buy-gzr/buy-gzr.module#BuyGzrModule',
        pathMatch: 'full'
      },
      {
        path: 'meta-mask',
        loadChildren: './pages/meta-mask/meta-mask.module#MetaMaskModule',
        pathMatch: 'full'
      },
      {
        path: 'open-treasure',
        loadChildren: './pages/open-treasure/open-treasure.module#OpenTreasureModule',
        pathMatch: 'full'
      }
    ]
  },
  { path: '**', redirectTo: 'not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
