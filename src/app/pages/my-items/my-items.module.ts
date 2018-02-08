import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyItemsComponent } from './my-items.component';
import { MyItemsRoutingModule } from './my-items-routing.module';
import { ComponentsModule } from '../../shared/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    MyItemsRoutingModule,
  ],
  declarations: [MyItemsComponent]
})
export class MyItemsModule { }
