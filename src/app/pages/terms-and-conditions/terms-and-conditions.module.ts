import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermsAndConditionsComponent } from './terms-and-conditions.component';
import { TermsAndConditionsRoutingModule } from './terms-and-conditions-routing.module';

@NgModule({
  imports: [
    CommonModule,
    TermsAndConditionsRoutingModule
  ],
  declarations: [TermsAndConditionsComponent]
})

export class TermsAndConditionsModule { }
