import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { setTimeout } from 'timers';

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
    private router: Router,
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
      this.router.navigate(['/']);
    }, 5000);
  }
}
