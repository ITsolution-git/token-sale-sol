import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderModule } from './header/header.module';
import { HeroSliderModule } from './hero-slider/hero-slider.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HeaderModule,
    HeroSliderModule,
  ],
  declarations: [
  ],
  exports: [
    HeaderModule,
    HeroSliderModule,
  ]
})
export class ComponentsModule { }
