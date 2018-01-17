import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
} from '@angular/router';
import { AuthService } from './../../core/services/auth.service';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
    isLoggedIn: boolean;
    constructor(
      private authService: AuthService,
      private router: Router,
      private localStorage: LocalStorageService,
    ) {
        authService.isLoggedIn$.subscribe(res => {
            this.isLoggedIn = res;
        });
    }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = this.localStorage.retrieve('token');
    if (token) { return true; }
    const url: string = state.url;
    return this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  checkLogin(url: string): boolean {
    if (this.isLoggedIn) { return true; }

    // Navigate to the login page with extras
    this.router.navigate(['/']);
    return false;
  }
}
