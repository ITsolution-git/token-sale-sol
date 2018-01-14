import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartnersComponent } from './partners.component';
import { PartnersRoutingModule } from './partners-routing.module';
import { ComponentsModule } from '../../shared/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    PartnersRoutingModule,
  ],
  declarations: [PartnersComponent]
})
export class PartnersModule { }
