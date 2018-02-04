import { Injectable } from '@angular/core';
import { HttpHelperService } from '../../../core/http-helper.service';
import { ApiRoutingService } from '../../../core/api-routing.service';
import { Component, EventEmitter, OnInit, Input, Output, HostListener, NgZone } from '@angular/core';
import Web3 from 'web3';
import Contract from 'truffle-contract';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import Tx from 'ethereumjs-tx';

const GZRArtifacts = require('../../../../../build/contracts/GizerToken.json');

declare var window: any;

@Injectable()
export class MetaMaskService {
  GzrToken = Contract(GZRArtifacts);

  accounts: any;
  web3: any;

  balance: number;
  balanceSubject = new Subject<number>();
  balanceObservable$ = this.balanceSubject.asObservable();

  gzrBalance: number;
  gzrBalanceSubject = new Subject<number>();
  gzrBalanceObservable$ = this.gzrBalanceSubject.asObservable();

  contractAddress: string;
  contractAddressSubject = new Subject<string>();
  contractAddressObservable$ = this.gzrBalanceSubject.asObservable();

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
  subscribed = false;

  constructor(
    private _ngZone: NgZone,
    private http: HttpHelperService,
    private apiRoutingService: ApiRoutingService
  ) {}

  getAccountInfo() {
    if (!this.subscribed) {
      this.subscribed = true;
      this.loadMetaObservable = Observable.interval(5000);
      this.loadMetaSubscription$ = this.loadMetaObservable.subscribe(x => {
        this.loadMetaCoin();
      });
    }
  }

  unloadAccountInfo() {
    this.loadMetaSubscription$.unsubscribe();
    this.subscribed = false;
  }

  checkIfSubscribed(): boolean {
    return this.subscribed;
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
    this.GzrToken.setProvider(this.web3.currentProvider);

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

  createGZR() {
    let gzr;
    return this.GzrToken
      .deployed()
      .then(instance => {
        gzr = instance;
        gzr.mintTokens.call(this.account, 2000);
      })
      .then(() => {
        return gzr.balanceOf(this.account);
      })
      .then(value => {
        // this.balance = value;
        console.log(this.web3.fromWei(value, 'ether').toString(10));
      })
      .catch(e => {
        console.log(e);
        this.setStatus('Error getting balance; see log.');
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
    return this.GzrToken.deployed()
    .then(instance => {
      this.contractAddress = instance.address;
      this.contractAddressSubject.next(this.contractAddress);

      return instance.balanceOf(address);
    })
    .catch(err => console.log(err));
  }

  refreshBalance() {
    this.getBalance(this.account)
    .then(balance => {
      this.balance = parseFloat(balance.toString());
      this.balanceSubject.next(this.balance);
    });

    this.balanceOf(this.account)
    .then(balance => {
        this.gzrBalance = Number(balance.toString()) / 1000000;
        this.gzrBalanceSubject.next(this.gzrBalance);
    });
  }

  setStatus(message) {
    this.status = message;
  }

  TransferEthToBuyGzr(ethValue, gzrValue) {
    let gzr;
    return new Promise((resolve, reject) => {
      this.GzrToken
        .deployed()
        .then(instance => {
          gzr = instance;
          gzr.sendTransaction({
            from: this.account, to: this.contractAddress, value: this.web3.toWei(ethValue, 'ether')
          }, (error, transactionId) => {
            gzr.balanceOf(this.account)
            .then((value) => {
              resolve({'success': true, 'value': value});
            })
            .catch((err) => {
              reject({'failure': true});
            });
          });
        })
        .catch(e => {
          reject({'failure': true});
          this.setStatus('Error getting balance; see log.');
        });
    });
  }

  SignInTransaction() {
    let gzr;
    return new Promise((resolve, reject) => {
      this.GzrToken
        .deployed()
        .then(instance => {
          gzr = instance;
          let code;
          this.web3.eth.getCode(this.account, (c) => {
            code = c;
            const transaction = {
               nonce: '0x00',
               to: this.contractAddress,
               value: '0x00',
               data: GZRArtifacts['bytecode']
            };
            const privateKey = new Buffer('3f23562d2acaf422a33f382dd4d2544e4fb7003116df1d62bb7b78ca77ceb843', 'hex');
            const tx = new Tx(transaction);
            tx.sign(privateKey);
            const serializedTx = tx.serialize();
            this.web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), (error, transactionId) => {
              console.log(error);
              gzr.balanceOf(this.account)
              .then((value) => {
                resolve({'success': true, 'value': value});
              })
              .catch((err) => {
                reject({'failure': true});
              });
            });
          });

        })
        .catch(e => {
          reject({'failure': true});
          this.setStatus('Error getting balance; see log.');
        });
    });
  }

  sendCoin(amount, receiver) {
    console.log('sending coin');
    // const amount = this.sendingAmount;
    // const receiver = this.recipientAddress;
    let meta;

    this.setStatus('Initiating transaction... (please wait)');

    this.GzrToken
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
