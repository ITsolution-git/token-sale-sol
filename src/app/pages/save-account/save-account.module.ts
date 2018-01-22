import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SaveAccountComponent } from './save-account.component';
import { SaveAccountRoutingModule } from './save-account-routing.module';
import { MetaMaskService } from '../../shared/services/MetaMaskService/meta-mask.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SaveAccountRoutingModule,
  ],
  declarations: [SaveAccountComponent],
  providers: [MetaMaskService]
})
export class SaveAccountModule { }
