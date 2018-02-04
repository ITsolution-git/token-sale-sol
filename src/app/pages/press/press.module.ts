import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PressComponent } from './press.component';
import { PressRoutingModule } from './press-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PressRoutingModule
  ],
  declarations: [PressComponent]
})
export class PressModule { }
