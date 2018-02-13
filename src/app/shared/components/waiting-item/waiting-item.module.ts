import { NgModule } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';


import { WaitingItemComponent } from './waiting-item.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [WaitingItemComponent],
  exports: [WaitingItemComponent],
})
export class WaitingItemModule { }
