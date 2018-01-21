import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MetaMaskService } from '../../shared/services/MetaMaskService/meta-mask.service';

@Component({
  selector: 'app-save-account',
  templateUrl: './save-account.component.html',
  styleUrls: ['./save-account.component.scss']
})
export class SaveAccountComponent implements OnInit {

  accountInfo: FormGroup;
  walletAddress: String = '';
  email: String = '';
  nickName: String = '';
  isSaving = false;
  loaded = false;

  constructor(
    private fb: FormBuilder,
    private localStorage: LocalStorageService,
    private router: Router,
    private authService: AuthService,
    private metaMaskService: MetaMaskService,
  ) {
      this.createForm();
   }

  ngOnInit() {
    this.metaMaskService.accountObservable$.subscribe(res => {
      if (this.walletAddress !== res) {
        this.walletAddress = res;
        this.accountInfo.setValue({
          walletAddress: this.walletAddress,
          email: this.email,
          nickName: this.nickName
        });
        this.loaded = true;
      }
    });
  }

  createForm() {
    this.accountInfo = this.fb.group({
      walletAddress: [{value: this.walletAddress, disabled: true}],
      email: [this.email, Validators.required ],
      nickName: this.nickName,
    });
  }

  onSaveInfo() {
    this.isSaving = true;
    setTimeout(() => {
      this.authService.login();
    }, 5000);
  }
}
