import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ItemComponent } from './item.component';

@NgModule({
  imports: [
      RouterModule,
      CommonModule,
    ],
  declarations: [ ItemComponent ],
  exports: [ ItemComponent ]
})
export class ItemModule {}
