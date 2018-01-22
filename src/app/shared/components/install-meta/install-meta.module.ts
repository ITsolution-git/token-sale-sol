import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstallMetaComponent } from './install-meta.component';
import { MetaMaskService } from '../../services/MetaMaskService/meta-mask.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [InstallMetaComponent],
  exports: [InstallMetaComponent],
  providers: [MetaMaskService]
})
export class InstallMetaModule { }
