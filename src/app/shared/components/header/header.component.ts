import { Component, OnInit, HostListener } from '@angular/core';
import { HeaderRoutes, MobileHeaderRoutes } from './header-routing.module';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../services/UserService/user.service';
import { MetaMaskService } from '../../services/MetaMaskService/meta-mask.service';
import { ApplicationState } from '../../../store/application-state';
import { UserState } from '../../../store/store-data';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { stat } from 'fs';
import { User } from '../../models/user.model';
import { environment } from '../../../../environments/environment.prod';
import { UserLocalstorageRepository } from '../../services/UserService/user.localstorage.repository.service';

import { UPDATE_NICK_NAME } from '../../../store/actions/user.actions';

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
  nickDisplay: string;
  installed = false;
  gzrBalance: number;
  toggled = false;
  users: User[] = [];
  saveUserIDStr = 'user_id';
  walletAddressStr = 'walletaddress';

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
    private userLocalstorageRepository: UserLocalstorageRepository,
    private modalService: BsModalService,
    private userService: UserService
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
    this.setAddressFromCookie();

    this.userState.subscribe(state => {
      if (state) {
        if (state.walletAddress && state.walletAddress !== this.walletAddress ) {
          this.checkUserIsExist(state.walletAddress);
          this.localStorage.store(this.walletAddressStr, state.walletAddress);
        }

        if (state.signup === true) {
          this.isAuthenticated = true;
        }

        if (state.walletAddress !== '') {
          this.walletAddress = state.walletAddress;
        }

        this.unlocked = state.unlocked;
        this.balance = state.balance;
        this.nickName = state.nickName;
        if (state.nickName != null) { this.nickDisplay = state.nickName.slice(0, 10); }
        this.installed = state.installed;
        this.gzrBalance = state.gzrBalance;
      }
    });
    this.init();
  }

  init() {
    this.isMobile = this.isMobileMenu();
  }

  UpdateNickName(data) {
    this.store.dispatch({type: UPDATE_NICK_NAME, payload: data});
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
    this.eventTrack('asked_change_user', null);
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
    this.router.navigate(['/buy-gzr']);
  }

  navigateToTokenSection() {
    this.eventTrack('viewed-what-is-gzr-page', null);
    this.router.navigate([''], {fragment: 'whatsgizer'});
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

  eventTrack(event, metadata) {
    if (!(metadata)) {
      (<any>window).Intercom('trackEvent', event);
    } else {
      (<any>window).Intercom('trackEvent', event, metadata);
    }
    return true;
  }

  initIntercom() {
    (<any>window).Intercom('boot', {
      app_id: environment.INTERCOM_APP_ID,
    });
  }

  updateUser(name, email, userId, customData) {
    (<any>window).Intercom('update', {
        name: name,
        email: email,
        user_id: userId,
        created_at: Math.ceil((new Date()).getTime() / 1000),
        custom_data: customData
    });
    return true;
  }

  updateCustomData(customData) {
    (<any>window).Intercom('update', {
        custom_data: customData
    });
    return true;
  }

  checkUserIsExist(walletAddress) {
    this.initIntercom();
    this.userService.retrieveUser(walletAddress).subscribe((resp) => {
      if (resp.length) {
        const user_ = resp[0];
        this.nickName = user_.nick;

        if (user_.nick != null) { this.nickDisplay = user_.nick.slice(0, 10); }
        this.localStorage.store(this.saveUserIDStr, user_.id);
        this.authService.login(this.walletAddress);
        this.isAuthenticated = true;

        setTimeout(() => {
          this.metaMaskService.getAccountInfo();
          this.UpdateNickName(user_.nick);
        }, 500);

        const {nick, email, id} = user_;

        this.userLocalstorageRepository.setUserId(id);
        const metadata = {
          created_at: Math.ceil((new Date(user_.created_at)).getTime() / 1000),
        };

        let purchased_gzr = false,
            total_gzr_purchased = 0,
            total_ether_spent = 0,
            opened_treasure = false,
            last_purchased_at = 0,
            last_opened_treasure_at = 0;

        if (user_.transactions.length > 0) {
          purchased_gzr = true;

          user_.transactions.map(tx => {
            total_gzr_purchased += tx.gzr;
            total_ether_spent += tx.eth;
          });
          const lastTx = user_.transactions.slice(-1).pop();
          last_purchased_at = Math.ceil((new Date(lastTx['confirmed_at'])).getTime() / 1000);
        }

        if (user_.owns.length > 0) {
          opened_treasure = true;
          last_opened_treasure_at = 0;
        }

        const customData =  {
          registered_metamask: true,
          registered_metamask_at: Math.ceil((new Date(user_.created_at)).getTime() / 1000),
          gzr_balance: user_.gzr.amount || 0,
          items_owned: user_.owns.length,
          nickname: nick,
          'wallet-id': id,
          opened_treasure: opened_treasure,
          purchased_gzr: purchased_gzr,
          total_gzr_purchased: total_gzr_purchased,
          total_ether_spent: total_ether_spent,
          last_purchased_at: last_purchased_at
        };

        if (last_purchased_at !== 0) {
          customData['last_purchased_at'] = last_purchased_at;
        }

        this.updateUser(nick, email, id, customData);
      } else {
        const customData = {
          registered_metamask: false
        };
        this.updateCustomData(customData);
        this.isAuthenticated = false;
        this.localStorage.clear(this.saveUserIDStr);
      }
    });
  }

  setAddressFromCookie() {
    const walletAddress = this.localStorage.retrieve(this.walletAddressStr);
    if (walletAddress !== undefined && walletAddress !== '' && walletAddress !== null) {
      this.walletAddress = walletAddress;
      this.checkUserIsExist(walletAddress);
    }
  }
}
