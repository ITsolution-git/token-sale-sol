import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SlickModule } from 'ngx-slick';
import { HeroSliderComponent } from './hero-slider.component';
import { Angulartics2Module } from 'angulartics2';

@NgModule({
  imports: [
      RouterModule,
      CommonModule,
      SlickModule.forRoot(),
      Angulartics2Module
    ],
  declarations: [ HeroSliderComponent ],
  exports: [ HeroSliderComponent ]
})
export class HeroSliderModule {}
