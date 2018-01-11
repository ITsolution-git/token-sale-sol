import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqComponent } from './faq.component';
import { FaqRoutingModule } from './faq-routing.module';
import { AccordionModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FaqRoutingModule,
    AccordionModule.forRoot(),
  ],
  declarations: [FaqComponent]
})
export class FaqModule { }
