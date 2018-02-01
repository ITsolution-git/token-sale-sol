import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenTreasureComponent } from './open-treasure.component';
import { OpenTreasureRoutingModule } from './open-treasure-routing.module';
import { ComponentsModule } from '../../shared/components/components.module';
import { ChestService } from '../../shared/services/ChestService/chest.service';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    OpenTreasureRoutingModule,
  ],
  declarations: [OpenTreasureComponent],
  exports: [OpenTreasureComponent],
  providers: [ChestService]
})
export class OpenTreasureModule { }
