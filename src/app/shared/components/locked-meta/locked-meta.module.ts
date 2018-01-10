import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LockedMetaComponent } from './locked-meta.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [LockedMetaComponent],
  exports: [LockedMetaComponent],
})
export class LockedMetaModule { }
