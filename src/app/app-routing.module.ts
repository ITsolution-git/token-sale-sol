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
      },
      {
        path: 'save-account',
        loadChildren: './pages/save-account/save-account.module#SaveAccountModule',
        pathMatch: 'full'
      },
      {
        path: 'faq',
        loadChildren: './pages/faq/faq.module#FaqModule',
        pathMatch: 'full'
      },
      {
        path: 'team',
        loadChildren: './pages/team/team.module#TeamModule',
        pathMatch: 'full'
      },
      {
        path: 'item-detail',
        loadChildren: './pages/item-detail/item-detail.module#ItemDetailModule',
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
