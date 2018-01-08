import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartnersComponent } from './partners.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PartnersComponent],
  exports: [PartnersComponent]
})
export class PartnersModule { }
