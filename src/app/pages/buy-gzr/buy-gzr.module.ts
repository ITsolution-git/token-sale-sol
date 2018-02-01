import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';

import { ComponentsModule } from '../../shared/components/components.module';
import { BuyGzrComponent } from './buy-gzr.component';
import { BuyGzrRoutingModule } from './buy-gzr-routing.module';
import { IonRangeSliderModule } from 'ng2-ion-range-slider';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    BuyGzrRoutingModule,
    IonRangeSliderModule,
    ModalModule,
  ],
  declarations: [
    BuyGzrComponent,
  ],
})
export class BuyGzrModule { }
