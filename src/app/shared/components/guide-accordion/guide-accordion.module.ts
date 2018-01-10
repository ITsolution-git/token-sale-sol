import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuideAccordionComponent } from './guide-accordion.component';
import { AccordionModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    AccordionModule.forRoot(),
  ],
  declarations: [GuideAccordionComponent],
  exports: [GuideAccordionComponent],
})
export class GuideAccordionModule { }
