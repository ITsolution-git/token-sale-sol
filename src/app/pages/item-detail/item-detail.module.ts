import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemDetailComponent } from './item-detail.component';
import { ItemDetailRoutingModule } from './item-detail-routing.module';
import { ComponentsModule } from '../../shared/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ItemDetailRoutingModule,
    ComponentsModule,
  ],
  declarations: [ItemDetailComponent]
})
export class ItemDetailModule { }
