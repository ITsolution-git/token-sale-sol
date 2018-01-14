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
      },
      {
        path: 'meta-mask',
        loadChildren: './pages/meta-mask/meta-mask.module#MetaMaskModule',
      },
      {
        path: 'open-treasure',
        loadChildren: './pages/open-treasure/open-treasure.module#OpenTreasureModule',
      },
      {
        path: 'save-account',
        loadChildren: './pages/save-account/save-account.module#SaveAccountModule',
        pathMatch: 'full'
      },
      {
        path: 'faq',
        loadChildren: './pages/faq/faq.module#FaqModule',
      },
      {
        path: 'team',
        loadChildren: './pages/team/team.module#TeamModule',
      },
      {
        path: 'item-detail',
        loadChildren: './pages/item-detail/item-detail.module#ItemDetailModule',
      },
      {
        path: 'terms-and-conditions',
        loadChildren: './pages/terms-and-conditions/terms-and-conditions.module#TermsAndConditionsModule',
      },
      {
        path: 'partners',
        loadChildren: './pages/partners/partners.module#PartnersModule',
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
