import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyPolicyComponent } from './privacy-policy.component';
import { PrivacyPolicyRoutingModule } from './privacy-policy-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PrivacyPolicyRoutingModule
  ],
  declarations: [PrivacyPolicyComponent]
})
export class PrivacyPolicyModule { }
