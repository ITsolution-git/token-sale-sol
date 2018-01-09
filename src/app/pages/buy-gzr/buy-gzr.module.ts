import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from '../../shared/components/components.module';

import { BuyGzrComponent } from './buy-gzr.component';
import { BuyGzrRoutingModule } from './buy-gzr-routing.module';
@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    BuyGzrRoutingModule
  ],
  declarations: [BuyGzrComponent]
})
export class BuyGzrModule { }
