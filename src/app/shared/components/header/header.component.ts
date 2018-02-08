import { Component, OnInit, HostListener } from '@angular/core';
import { HeaderRoutes, MobileHeaderRoutes } from './header-routing.module';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ProfileModalComponent } from '../profile-modal/profile-modal.component';

import { AuthService } from '../../../core/services/auth.service';
import { MetaMaskService } from '../../services/MetaMaskService/meta-mask.service';
import { ApplicationState } from '../../../store/application-state';
import { UserState } from '../../../store/store-data';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

declare const $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent implements OnInit {
  public menuItems: any[];
  public mobileMenuItems: any[];
  public brandMenu: any;
  userState: Observable<UserState>;
  private user: any;
  isMobile = false;
  isCollapsed = true;
  isAuthenticated = false;
  walletAddress: String;
  unlocked = false;
  balance: number;
  nickName: String;
  installed = false;
  gzrBalance: number;
  toggled = false;

  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: false
  };

  bsModalRef: BsModalRef;

  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
    private authService: AuthService,
    private store: Store<ApplicationState>,
    private metaMaskService: MetaMaskService,
    private modalService: BsModalService,
  ) {
    this.initTwitterWidget();
    this.initFacebookWidget();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.toggled = false;
      }
    });
    this.userState = this.store.select('userState');
  }

  ngOnInit() {
    this.menuItems = HeaderRoutes;
    this.mobileMenuItems = MobileHeaderRoutes;
    this.metaMaskService.getAccountInfo();

    this.userState.subscribe(state => {
      if (state) {
        this.walletAddress = state.walletAddress;
        this.unlocked = state.unlocked;
        this.balance = state.balance;
        this.nickName = state.nickName;
        this.installed = state.installed;
        this.gzrBalance = state.gzrBalance;
      }
    });
    this.init();
  }

  init() {
    this.isMobile = this.isMobileMenu();
    const token = this.localStorage.retrieve('token');
    if (token) {
      this.isAuthenticated = true;
    } else {
      this.authService.isLoggedIn$.subscribe(flag => {
        this.isAuthenticated = flag;
      });
    }
  }

  isMobileMenu() {
    if ($(window).width() > 425) {
        return false;
    }
    return true;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
     this.isMobile = this.isMobileMenu();
  }

  login() {
    if (this.installed && this.unlocked) {
      this.navgiateToSaveAccount();
    } else {
      this.navgiateToInstallMeta();
    }
  }

  logout() {
    this.isAuthenticated = false;
    this.authService.logout();
  }

  onMenuToggle() {
    this.toggled = !this.toggled;
  }

  navgiateToTreasure() {
    this.router.navigate(['/open-treasure']);
  }

  navgiateToInstallMeta() {
    this.router.navigate(['/meta-mask']);
  }

  navgiateToSaveAccount() {
    this.router.navigate(['/save-account']);
  }

  navgiateToBuyGizer() {
    this.bsModalRef = this.modalService.show(ProfileModalComponent, Object.assign({}, this.config, { class: 'gray modal-md' }));
  }

  navigateToTokenSection() {
    this.router.navigate([''], {fragment: 'whatsgizer'});
  }

  showProfileModal() {
    this.bsModalRef = this.modalService.show(ProfileModalComponent, Object.assign({}, this.config, { class: 'gray modal-md' }));
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
