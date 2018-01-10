import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OpenTreasureComponent } from './open-treasure.component';

const routes: Routes = [
  {
    path: '', component: OpenTreasureComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpenTreasureRoutingModule { }
