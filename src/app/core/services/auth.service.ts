import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable()
export class AuthService {
  private isLoggedIn = new Subject<boolean>();
  isLoggedIn$ = this.isLoggedIn.asObservable();

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
    this.router.navigate(['/']);
  }

  logout() {
    this.isLoggedIn.next(false);
    this.router.navigate(['/meta-mask']);
  }
}
