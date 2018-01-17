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
    const token = this.localStorage.retrieve('token');
    if (token) { this.isLoggedIn.next(true); }
  }

  setLoginFlag(flag: boolean) {
    this.isLoggedIn.next(flag);
  }

  login() {
    this.isLoggedIn.next(true);
    this.localStorage.store('token', 'afgeFb596hHHHPlKEgnzafSFcceR3xXCfiUvHKAVvb25IZn8pZiqFxtFoBVxzfA');
    this.router.navigate(['/']);
  }

  logout() {
    this.isLoggedIn.next(false);
    this.localStorage.clear('token');
    this.router.navigate(['/meta-mask']);
  }
}
