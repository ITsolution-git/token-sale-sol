import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderModule } from './header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HeaderModule,
  ],
  declarations: [
  ],
  exports: [
    HeaderModule
  ]
})
export class ComponentsModule { }
