import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenerateItemComponent } from './generate-item.component';
import { GenerateItemRoutingModule } from './generate-item-routing.module';


@NgModule({
  imports: [
    CommonModule,
    GenerateItemRoutingModule
  ],
  declarations: [GenerateItemComponent]
})
export class GenerateItemModule { }
