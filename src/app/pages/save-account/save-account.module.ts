import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SaveAccountComponent } from './save-account.component';
import { SaveAccountRoutingModule } from './save-account-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SaveAccountRoutingModule,
  ],
  declarations: [SaveAccountComponent],
})
export class SaveAccountModule { }
