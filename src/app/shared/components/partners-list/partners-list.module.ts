import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartnersListComponent } from './partners-list.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PartnersListComponent],
  exports: [PartnersListComponent]
})
export class PartnersListModule { }
