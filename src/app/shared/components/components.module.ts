import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderModule } from './header/header.module';
import { HeroSliderModule } from './hero-slider/hero-slider.module';
import { ItemListModule } from './item-list/item-list.module';
import { WelcomeModule } from './welcome/welcome.module';
import { GzrTokenModule } from './gzr-token/gzr-token.module';
import { PartnersModule } from './partners/partners.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HeaderModule,
    HeroSliderModule,
    ItemListModule,
    WelcomeModule,
    GzrTokenModule,
    PartnersModule,
  ],
  declarations: [],
  exports: [
    HeaderModule,
    HeroSliderModule,
    ItemListModule,
    WelcomeModule,
    GzrTokenModule,
    PartnersModule,
  ]
})
export class ComponentsModule { }
