import { Component, OnInit } from '@angular/core';
import { HeaderRoutes } from './header-routing.module';
import { Router, NavigationEnd } from '@angular/router';
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
    this.initTwitterWidget();
    this.initFacebookWidget();
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

  navgiateToBuyGizer() {
    this.router.navigate(['/buy-gzr']);
  }

  public get menuIcon(): string {
    return this.isCollapsed ? '☰' : '✖';
  }

  initTwitterWidget() {
    (<any>window).twttr = (function (d, s, id) {
      // tslint:disable-next-line:prefer-const
      let js: any, fjs = d.getElementsByTagName(s)[0],
          // tslint:disable-next-line:prefer-const
          t = (<any>window).twttr || {};
      // tslint:disable-next-line:curly
      if (d.getElementById(id)) return t;
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://platform.twitter.com/widgets.js';
      fjs.parentNode.insertBefore(js, fjs);

      t._e = [];
      t.ready = function (f: any) {
          t._e.push(f);
      };
      return t;
    }(document, 'script', 'twitter-wjs'));

    // tslint:disable-next-line:curly
    if ((<any>window).twttr.ready()) {
      (<any>window).twttr.widgets.load();
    }
  }

  initFacebookWidget() {
    (<any>window).facebook = (function(d, s, id) {
      // tslint:disable-next-line:prefer-const
      let js, fjs = d.getElementsByTagName(s)[0];
      // tslint:disable-next-line:curly
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.11';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }
}
