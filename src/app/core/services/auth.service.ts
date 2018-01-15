import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AuthService {
  private isLoggedIn = new Subject<boolean>();
  isLoggedIn$ = this.isLoggedIn.asObservable();

  constructor( private router: Router ) {}

  setLoginFlag(flag: boolean) {
    this.isLoggedIn.next(flag);
  }

  login() {
    this.isLoggedIn.next(true);
    this.router.navigate(['/']);
  }

  logout() {
    this.isLoggedIn.next(false);
    this.router.navigate(['/meta-mask']);
  }
}
