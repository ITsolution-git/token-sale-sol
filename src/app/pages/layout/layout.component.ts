import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ValidNetworkModalComponent } from '../../shared/components/valid-network/valid-network.component';
import { LocalStorageService } from 'ngx-webstorage';
import { Intercom } from 'ng-intercom';

import { MetaMaskService } from '../../shared/services/MetaMaskService/meta-mask.service';
import { UserService } from '../../shared/services/UserService/user.service';
// tslint:disable-next-line:max-line-length
import { UPDATE_VALID_NETWORK, UPDATE_WALLET_ADDRESS, UPDATE_LOCK_STATUS, UPDATE_GZR_BALANCE, UPDATE_BALANCE, UPDATE_INSTALL_STATUS, UPDATE_TRANSACTION_ID, UPDATE_NICK_NAME } from './../../store/actions/user.actions';
import { ApplicationState } from '../../store/application-state';
import { UserState } from '../../store/store-data';
import { User } from '../../shared/models/user.model';
import { NotificationsService } from 'angular2-notifications-lite';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, AfterViewInit {

  userState: Observable<UserState>;
  installed = true;
  unlocked = false;
  walletAddress: String;
  balance: number;
  gzrBalance: number;
  transactionId: String;
  nickName: String;
  validNetwork = false;

  options = {
      position: ['top', 'right'],
      timeOut: 2000,
      lastOnBottom: true
  };

  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: false
  };

  bsModalRef: BsModalRef;
  nickNameStr = 'nickName';
  walletStr = 'walletAddress';

  constructor(
    public intercom: Intercom,
    private metaMaskService: MetaMaskService,
    private userService: UserService,
    private store: Store<ApplicationState>,
    private notificationService: NotificationsService,
    private modalService: BsModalService,
  ) {
    this.userState = this.store.select('userState');
  }

  ngOnInit() {
    this.initIntercom();
    this.metaMaskService.getAccountInfo();
    this.userState.subscribe(state => {
      if (state) {
        this.installed = state.installed;
        this.unlocked = state.unlocked;
        this.walletAddress = state.walletAddress;
        this.balance = state.balance;
        this.gzrBalance = state.gzrBalance;
        this.nickName = state.nickName;
        this.validNetwork = state.validNetwork;
      }
    });
    this.metaMaskService.installedObservable$.subscribe(status => {
      if (!status) {
        this.updateInstallStatus(status);
        this.metaMaskService.unloadAccountInfo();
      }
      if (this.installed !== status) {
          this.updateInstallStatus(status);
      }
    });
    this.metaMaskService.unlockedObservable$.subscribe(status => {

      if (this.unlocked !== status) {
        this.updateLockStatus(status);
      }
    });
    this.metaMaskService.accountObservable$.subscribe(res => {
      if (this.walletAddress !== res) {
        this.updateWalletAddress(res);
        this.userService.retriveUser(res).subscribe(user => {
          if (user.length) {
            this.updateNickName(user[0].nick);
            const {email, id} = user[0];
            this.loadIntercom(email, id);
          }
        });
      }
    });
    this.metaMaskService.balanceObservable$.subscribe(res => {
      if (this.balance !== res) {
        this.updateBalance(res);
      }
    });

    this.metaMaskService.gzrBalanceObservable$.subscribe(res => {
      if (this.gzrBalance !== res) {
        this.updateGZRBalance(res);
      }
    });

    this.metaMaskService.transactionIdObservable$.subscribe(transactionId => {
      if (this.transactionId !== transactionId) {
        this.updateTransactionId(transactionId);
      }
    });

    this.metaMaskService.validNetworkObservable$.subscribe(status => {
      if (this.validNetwork !== status) {
        this.updateNetworkStatus(status);
      }

      if (!status && !this.bsModalRef) {
          this.bsModalRef = this.modalService.show(ValidNetworkModalComponent, Object.assign({}, this.config, { class: 'gray modal-lg' }));
      }
    });

    this.metaMaskService.signTransactionPendingObservable$.subscribe(signTransaction => {
      this.notificationService.success(
          'Sign To GZR',
          'You are signing to gzr token',
          {
              timeOut: 3000,
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: false,
              maxLength: 10
          }
      );
    });
  }

  ngAfterViewInit() {
    this.userService.retriveUser(this.walletAddress).subscribe(user => {
      this.updateNickName(user.nick);
    });
  }

  updateInstallStatus(data) {
    this.store.dispatch({type: UPDATE_INSTALL_STATUS, payload: data});
  }

  updateLockStatus(data) {
    this.store.dispatch({type: UPDATE_LOCK_STATUS, payload: data});
  }

  updateWalletAddress(data) {
    this.store.dispatch({type: UPDATE_WALLET_ADDRESS, payload: data});
  }

  updateBalance(data) {
    this.store.dispatch({type: UPDATE_BALANCE, payload: data});
  }

  updateGZRBalance(data) {
    this.store.dispatch({type: UPDATE_GZR_BALANCE, payload: data});
  }


  updateTransactionId(data) {
    this.store.dispatch({type: UPDATE_TRANSACTION_ID, payload: data});
  }

  updateNickName(data) {
    this.store.dispatch({type: UPDATE_NICK_NAME, payload: data});
  }

  updateNetworkStatus(data) {
    this.store.dispatch({type: UPDATE_VALID_NETWORK, payload: data});
  }

  onDeactivate() {
    window.scrollTo(0, 0);
  }

  initIntercom() {
    (<any>window).Intercom('boot', {
      app_id: 'pjrvbrtn'
    });
  }

  loadIntercom(email, userId) {
    (<any>window).Intercom('boot', {
      app_id: environment.INTERCOM_APP_ID,
      custom_launcher_selector: '#IntercomDefaultWidget',
      email: email,
      user_id: userId,
      created_at: Date.now(),
   });
  }

  updateIntercom(email, userId) {
    (<any>window).Intercom('update', {email: email, user_id: userId});
  }

  updateIntercomRefresh() {
    (<any>window).Intercom('update');
  }
}
