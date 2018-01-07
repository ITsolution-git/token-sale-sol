import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SlickModule } from 'ngx-slick';
import { ItemListComponent } from './item-list.component';
import { ItemModule } from '../item/item.module';

@NgModule({
  imports: [
      RouterModule,
      CommonModule,
      ItemModule,
      SlickModule.forRoot(),
    ],
  declarations: [ ItemListComponent ],
  exports: [ ItemListComponent ]
})
export class ItemListModule {}
