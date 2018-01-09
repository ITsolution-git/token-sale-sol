import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BuyGzrComponent } from './buy-gzr.component';

const routes: Routes = [
    { path: '', component: BuyGzrComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BuyGzrRoutingModule { }
