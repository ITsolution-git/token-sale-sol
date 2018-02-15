import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '../../shared/components/components.module';
import { LayoutComponent } from './layout.component';
import { MetaMaskService } from '../../shared/services/MetaMaskService/meta-mask.service';
import { UserService } from '../../shared/services/UserService/user.service';
import { SimpleNotificationsModule } from 'angular2-notifications-lite';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule,
    SimpleNotificationsModule.forRoot()
  ],
  declarations: [LayoutComponent],
  providers: [
    MetaMaskService,
    UserService
  ]
})
export class LayoutModule { }
