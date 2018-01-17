import { Component, OnInit } from '@angular/core';
import { HeaderRoutes } from './header-routing.module';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from '../../../core/services/auth.service';
import { Observable } from 'rxjs/Observable';
import { debounce } from 'rxjs/operators/debounce';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public menuItems: any[];
  public brandMenu: any;
  isCollapsed = true;
  isAuthenticated = false;

  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.menuItems = HeaderRoutes;
    const token = this.localStorage.retrieve('token');
    if (token) {
      this.isAuthenticated = true;
    } else {
      this.authService.isLoggedIn$.subscribe(flag => {
        this.isAuthenticated = flag;
      });
    }
  }

  login() {
    this.navgiateToInstallMeta();
  }

  logout() {
    this.isAuthenticated = false;
    this.authService.logout();
  }

  navgiateToTreasure() {
    this.router.navigate(['/open-treasure']);
  }

  navgiateToInstallMeta() {
    this.router.navigate(['/meta-mask']);
  }

  public get menuIcon(): string {
    return this.isCollapsed ? '☰' : '✖';
  }

}
