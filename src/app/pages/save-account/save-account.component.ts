import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-save-account',
  templateUrl: './save-account.component.html',
  styleUrls: ['./save-account.component.scss']
})
export class SaveAccountComponent implements OnInit {
  accountInfo: FormGroup;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private localStorage: LocalStorageService,
    private router: Router,
    private authService: AuthService,
  ) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.accountInfo = this.fb.group({
      walletAddress: '',
      email: ['', Validators.required ],
      nickName: '',
    });
  }

  onSaveInfo() {
    this.isSaving = true;
    setTimeout(() => {
      this.authService.login();
    }, 5000);
  }
}
