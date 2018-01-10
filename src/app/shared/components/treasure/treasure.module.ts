import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreasureComponent } from './treasure.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TreasureComponent],
  exports: [TreasureComponent],
})
export class TreasureModule { }
