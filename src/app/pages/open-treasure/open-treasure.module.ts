import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenTreasureComponent } from './open-treasure.component';
import { OpenTreasureRoutingModule } from './open-treasure-routing.module';
import { ComponentsModule } from '../../shared/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    OpenTreasureRoutingModule,
  ],
  declarations: [OpenTreasureComponent],
  exports: [OpenTreasureComponent],
})
export class OpenTreasureModule { }
