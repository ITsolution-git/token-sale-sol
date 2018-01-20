import { Injectable } from '@angular/core';
import { HttpHelperService } from '../../../core/http-helper.service';
import { ApiRoutingService } from '../../../core/api-routing.service';
import { Component, EventEmitter, OnInit, Input, Output, HostListener, NgZone } from '@angular/core';
import Web3 from 'web3';
import Contract from 'truffle-contract';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

declare var window: any;

@Injectable()
export class MetaMaskService {
  metaCoin: any;

  accounts: any;
  web3: any;

  balance: number;
  sendingAmount: number;
  recipientAddress: string;
  status: string;

  private account = new Subject<any>();
  account$ = this.account.asObservable();

  constructor(
    private _ngZone: NgZone,
    private http: HttpHelperService,
    private apiRoutingService: ApiRoutingService
  ) { }

  getMetaCoin() {
    return this.http.get(
      this.apiRoutingService.getMetaCoinUrl(),
      {},
      true,
      null
    );
  }

  getUserWalletAddress(): Observable<any> {
    return this.account$;
  }

  setUserWalletAddress(account: any): void {
    this.account.next(account);
  }

  @HostListener('window:load')
  windowLoaded() {
    this.checkAndInstantiateWeb3();
    this.onReady();
  }

  checkAndInstantiateWeb3 = () => {
    if (typeof window.web3 !== 'undefined') {
      console.warn(
        // tslint:disable-next-line:max-line-length
        'Using web3 detected from external source. If you find that your accounts don\'t appear or you have 0 MetaCoin, ensure you\'ve configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask'
      );
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.warn(
        // tslint:disable-next-line:max-line-length
        'No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it\'s inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
      );
      this.web3 = new Web3(
        new Web3.providers.HttpProvider('http://localhost:8545')
      );
    }
  }

  onReady() {
    this.metaCoin.setProvider(this.web3.currentProvider);

    this.web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        alert('There was an error fetching your accounts.');
        return;
      }

      if (accs.length === 0) {
        alert(
          'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'
        );
        return;
      }
      this.accounts = accs;
      this.account = this.accounts[0];
      console.log(this.account);
      this._ngZone.run(() =>
        this.refreshBalance()
      );
    });
  }

  refreshBalance = () => {
    let meta;
    this.metaCoin
      .deployed()
      .then(instance => {
        meta = instance;
        console.log(meta);
        return meta.getBalance.call(this.account, {
          from: this.account
        });
      })
      .then(value => {
        this.balance = value;
      })
      .catch(e => {
        console.log(e);
        this.setStatus('Error getting balance; see log.');
      });
  }

  setStatus = message => {
    this.status = message;
  }

  sendCoin = () => {
    const amount = this.sendingAmount;
    const receiver = this.recipientAddress;
    let meta;

    this.setStatus('Initiating transaction... (please wait)');

    this.metaCoin
      .deployed()
      .then(instance => {
        meta = instance;
        return meta.sendCoin(receiver, amount, {
          from: this.account
        });
      })
      .then(() => {
        this.setStatus('Transaction complete!');
        this.refreshBalance();
      })
      .catch(e => {
        console.log(e);
        this.setStatus('Error sending coin; see log.');
      });
  }
}
