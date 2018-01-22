import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '../../shared/components/components.module';
import { LayoutComponent } from './layout.component';
import { MetaMaskService } from '../../shared/services/MetaMaskService/meta-mask.service';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule
  ],
  declarations: [LayoutComponent],
  providers: [ MetaMaskService ]
})
export class LayoutModule { }
