import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetaMaskComponent } from './meta-mask.component';
import { MetaMaskRoutingModule } from './meta-mask-routing.module';
import { ComponentsModule } from '../../shared/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    MetaMaskRoutingModule,
    ComponentsModule,
  ],
  declarations: [MetaMaskComponent]
})
export class MetaMaskModule { }
