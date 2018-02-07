import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyItemsComponent } from './my-items.component';

const routes: Routes = [
  {
    path: '', component: MyItemsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyItemsRoutingModule { }
