import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SaveAccountComponent } from './save-account.component';

const routes: Routes = [
  {
    path: '', component: SaveAccountComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaveAccountRoutingModule { }
