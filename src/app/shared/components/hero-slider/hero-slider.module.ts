import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SlickModule } from 'ngx-slick';
import { HeroSliderComponent } from './hero-slider.component';

@NgModule({
  imports: [
      RouterModule,
      CommonModule,
      SlickModule.forRoot(),
    ],
  declarations: [ HeroSliderComponent ],
  exports: [ HeroSliderComponent ]
})
export class HeroSliderModule {}
