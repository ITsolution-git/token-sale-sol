import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header.component';
import { MetaMaskService } from '../../services/MetaMaskService/meta-mask.service';

@NgModule({
  imports: [ RouterModule, CommonModule ],
  declarations: [ HeaderComponent ],
  exports: [ HeaderComponent ],
  providers: [ MetaMaskService ]
})
export class HeaderModule {}
