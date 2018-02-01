import { Injectable } from '@angular/core';
import { HttpHelperService } from '../../../core/http-helper.service';
import { ApiRoutingService } from '../../../core/api-routing.service';
import { Component, EventEmitter, OnInit, Input, Output, HostListener, NgZone } from '@angular/core';
import Web3 from 'web3';
import Contract from 'truffle-contract';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

const metaincoinArtifacts = require('../../../../../build/contracts/MetaCoin.json');
const gzrArtifacts = require('../../../../../build/contracts/GZR.json');
declare var window: any;

@Injectable()
export class MetaMaskService {
  metaCoin = Contract(metaincoinArtifacts);
  GZR = Contract(gzrArtifacts);

  accounts: any;
  web3: any;

  balance: number;
  balanceSubject = new Subject<number>();
  balanceObservable$ = this.balanceSubject.asObservable();

  gzrBalance: number;
  gzrBalanceSubject = new Subject<number>();
  gzrBalanceObservable$ = this.gzrBalanceSubject.asObservable();

  sendingAmount: number;
  recipientAddress: string;
  status: string;
  account: string;

  unlocked = false;
  unlockedSubject = new Subject<boolean>();
  unlockedObservable$ = this.unlockedSubject.asObservable();

  installed = false;
  installedSubject = new Subject<boolean>();
  installedObservable$ = this.installedSubject.asObservable();

  accountSubject = new Subject<any>();
  accountObservable$ = this.accountSubject.asObservable();

  loadMetaObservable: any;
  loadMetaSubscription$: Subscription = new Subscription();

  constructor(
    private _ngZone: NgZone,
    private http: HttpHelperService,
    private apiRoutingService: ApiRoutingService
  ) {
  }

  getAccountInfo() {
    this.loadMetaObservable = Observable.interval(5000);
    this.loadMetaSubscription$ = this.loadMetaObservable.subscribe(x => {
      this.loadMetaCoin();
    });
  }

  unloadAccountInfo() {
    this.loadMetaSubscription$.unsubscribe();
  }

  loadMetaCoin() {
    this.checkAndInstantiateWeb3();
    this.onReady();
  }

  checkAndInstantiateWeb3() {
    if (typeof window.web3 !== 'undefined') {
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      this.web3 = new Web3(
        new Web3.providers.HttpProvider('http://localhost:8545')
      );
    }
  }

  onReady() {
    this.metaCoin.setProvider(this.web3.currentProvider);
    this.GZR.setProvider(this.web3.currentProvider);

    this.web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        console.log('No MetaMask installed! Please install MetaMask Chrome Extension!');
        this.installed = false;
        this.installedSubject.next(this.installed);
        return;
      }
      this.installed = true;
      this.installedSubject.next(this.installed);

      if (accs.length === 0) {
        console.log('Your MetaMask is Locked!');
        this.unlocked = false;
        this.unlockedSubject.next(this.unlocked);
        return;
      }

      this.unlocked = true;
      this.unlockedSubject.next(this.unlocked);
      this.accounts = accs;
      this.account = this.accounts[0];
      this.accountSubject.next(this.account);
      this.refreshBalance();
    });
  }

  getBalance(address) {
    return new Promise ((resolve, reject) => {
      this.web3.eth.getBalance(address, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(this.web3.fromWei(result, 'ether').toString(10));
        }
      });
    });
  }

  balanceOf(address) {
    return this.GZR.deployed()
    .then(instance => instance.balanceOf(address))
    .catch(err=> console.log(err))    
  }

  refreshBalance() {
    this.getBalance(this.account)
    .then(balance => {
      this.balance = parseFloat(balance.toString());
      this.balanceSubject.next(this.balance);
    });

    this.balanceOf(this.account)
    .then(balance => {
        this.gzrBalance = parseFloat( balance.c[1] ? balance.c[1] : 0 );
        this.gzrBalanceSubject.next(this.gzrBalance);
    })
  }

  setStatus(message) {
    this.status = message;
  }

  sendCoin(amount, receiver) {
    console.log('sending coin');
    // const amount = this.sendingAmount;
    // const receiver = this.recipientAddress;
    let meta;

    this.setStatus('Initiating transaction... (please wait)');

    this.metaCoin
      .deployed()
      .then(instance => {
        meta = instance;
        console.log(meta);
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
