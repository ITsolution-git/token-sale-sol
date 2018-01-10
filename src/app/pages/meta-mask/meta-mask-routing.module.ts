import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MetaMaskComponent } from './meta-mask.component';

const routes: Routes = [
  {
    path: '', component: MetaMaskComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MetaMaskRoutingModule { }
