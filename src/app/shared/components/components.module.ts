import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderModule } from './header/header.module';
import { HeroSliderModule } from './hero-slider/hero-slider.module';
import { ItemListModule } from './item-list/item-list.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HeaderModule,
    HeroSliderModule,
    ItemListModule,
  ],
  declarations: [],
  exports: [
    HeaderModule,
    HeroSliderModule,
    ItemListModule,
  ]
})
export class ComponentsModule { }
