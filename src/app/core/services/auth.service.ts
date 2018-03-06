import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable()
export class AuthService {
  private isLoggedIn = new Subject<boolean>();
  isLoggedIn$ = this.isLoggedIn.asObservable();
  saveUserIDStr = 'user_id';

  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
  ) {
  }

  setLoginFlag(flag: boolean) {
    this.isLoggedIn.next(flag);
  }

  login(wallet: String = '') {
    this.isLoggedIn.next(true);
    this.localStorage.store('token', 'token');
    this.router.navigate(['/']);
  }

  logout() {
    this.isLoggedIn.next(false);
    this.localStorage.clear(this.saveUserIDStr);
    this.router.navigate(['/meta-mask']);
  }

  checkLogin() {
    if (!this.localStorage.retrieve(this.saveUserIDStr)) {
      this.router.navigate(['/save-account']);
      return false;
    }
    return true;
  }
}
