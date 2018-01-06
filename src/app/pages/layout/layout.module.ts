import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '../../shared/components/components.module';
import { LayoutComponent } from './layout.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule
  ],
  declarations: [LayoutComponent]
})
export class LayoutModule { }
