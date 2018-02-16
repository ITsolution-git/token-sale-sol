import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenerateItemComponent } from './generate-item.component';

const routes: Routes = [
    { path: '', component: GenerateItemComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GenerateItemRoutingModule { }
