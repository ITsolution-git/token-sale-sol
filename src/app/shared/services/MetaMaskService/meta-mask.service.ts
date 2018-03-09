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
const StandardTokenArtifacts = require('../../../../../build/contracts/StandardToken.json');
const GizerItemsArtifacts = require('../../../../../build/contracts/GizerItems.json');

declare var window: any;

@Injectable()
export class MetaMaskService {

  GizerToken = Contract(GZRArtifacts);
  StandardToken = Contract(StandardTokenArtifacts);
  GizerItems = Contract(GizerItemsArtifacts);

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
  contractAddressObservable$ = this.contractAddressSubject.asObservable();

  transactionId: string;
  transactionIdSubject = new Subject<string>();
  transactionIdObservable$ = this.transactionIdSubject.asObservable();

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

  validNetwork = false;
  validNetworkSubject = new Subject<boolean>();
  validNetworkObservable$ = this.validNetworkSubject.asObservable();

  signTransactionPending = 0;
  signTransactionPendingSubject = new Subject<number>();
  signTransactionPendingObservable$ = this.signTransactionPendingSubject.asObservable();

  buyGZRTransaction = 0;
  buyGZRTransactionSubject = new Subject<number>();
  buyGZRTransactionObservable$ = this.buyGZRTransactionSubject.asObservable();

  accountSubject = new Subject<any>();
  accountObservable$ = this.accountSubject.asObservable();

  treasureTransactionSubject = new Subject<any>();
  treasureTransactionObservable$ = this.treasureTransactionSubject.asObservable();

  GZRContractInstanceSubject = new Subject<any>();
  GZRContractInstance$ = this.GZRContractInstanceSubject.asObservable();

  ItemsContractInstanceSubject = new Subject<any>();
  ItemsContractInstance$ = this.ItemsContractInstanceSubject.asObservable();


  loadMetaObservable: any;
  loadMetaSubscription$: Subscription = new Subscription();

  checkTxStatusObservable: any;
  checkTxStatusSusbscription$: Subscription = new Subscription();

  subscribed = false;
  purchasedEtherValue = 0;
  purchasedGZRValue = 0;

  constructor(
    private _ngZone: NgZone,
    private http: HttpHelperService,
    private apiRoutingService: ApiRoutingService
  ) { }

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
    this.checkAndInstantiateWeb3()
      .then((status: boolean) => {
        this.onReady();
        this.validNetwork = status;
        this.validNetworkSubject.next(this.validNetwork);
      })
      .catch(() => {
        this.validNetwork = false;
        this.validNetworkSubject.next(this.validNetwork);
      });
  }

  checkAndInstantiateWeb3() {
    return new Promise((resolve, reject) => {
      if (typeof window.web3 !== 'undefined') {
        this.installed = true;
        this.installedSubject.next(this.installed);
        this.web3 = new Web3(window.web3.currentProvider);

        window.web3.version.getNetwork((err, netId) => {
          switch (netId) {
            case '3':
              resolve(true);
              break;
            default:
              resolve(false);
          }
        });
      } else {
        this.installed = false;
        this.installedSubject.next(this.installed);
        reject(false);
      }
    });
  }

  onReady() {
    this.GizerToken.setProvider(this.web3.currentProvider);
    this.StandardToken.setProvider(this.web3.currentProvider);
    this.GizerItems.setProvider(this.web3.currentProvider);

    this.web3.eth.getAccounts((err, accs) => {

      this.installed = true;
      this.installedSubject.next(this.installed);

      if (accs.length === 0) {
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
    return this.GizerToken
      .deployed()
      .then(instance => {
        gzr = instance;
        gzr.mintTokens.call(this.account, 2000);
      })
      .then(() => {
        return gzr.balanceOf(this.account);
      })
      .then(value => {
      })
      .catch(e => {
        this.setStatus('Error getting balance; see log.');
      });
  }

  getBalance(address) {
    return new Promise((resolve, reject) => {
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
    if (this.validNetwork === false) {
      return;
    }
    return this.GizerToken.deployed()
      .then(instance => {
        this.contractAddress = instance.address;
        this.contractAddressSubject.next(this.contractAddress);
        return instance.balanceOf(address);
      });
  }

  refreshBalance() {
    if (this.validNetwork === false) {
      return;
    }
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

  checkTransactionStatus(transactionId) {
    this.checkTxStatusObservable = Observable.interval(3000);
    return new Promise((resolve, reject) => {
      this.checkTxStatusSusbscription$ = this.checkTxStatusObservable.subscribe(() => {
        this.checkTransaction(transactionId, resolve, reject);
      });
    });
  }

  checkTransaction(txId, resolve, reject) {
    this.web3.eth.getTransactionReceipt(txId, (err, res) => {
      if (err) {
        reject(err);
      } else {
        if (res == null) {
          this.transactionId = txId;
          this.transactionIdSubject.next(this.transactionId);
          return;
        } else if (res.status === 1) {
          resolve({ 'success': true, 'transaction': txId, 'etherValue': this.purchasedEtherValue, 'gzrValue': this.purchasedGZRValue });
          this.checkTxStatusSusbscription$.unsubscribe();
        } else {
          resolve({ 'success': false, 'transaction': txId, 'etherValue': this.purchasedEtherValue, 'gzrValue': this.purchasedGZRValue });
          this.checkTxStatusSusbscription$.unsubscribe();
        }
        this.refreshBalance();
      }
    });
  }

  TransferEthToBuyGzr(ethValue, gzrValue) {
    if (this.validNetwork === false) {
      return;
    }

    let gzr;
    return new Promise((resolve, reject) => {
      this.GizerToken
        .deployed()
        .then(instance => {
          gzr = instance;
          gzr.sendTransaction({
            from: this.account, to: this.contractAddress, value: this.web3.toWei(ethValue, 'ether')
          }, (error, transactionId) => {
            if (error) {
              reject({ 'failure': true });
            } else {
              resolve({ 'success': true, 'transaction': transactionId });
            }
          });
        })
        .catch(e => {
          reject({ 'failure': true });
          this.setStatus('Error getting balance; see log.');
        });
    });
  }

  SignInTransaction() {
    if (this.validNetwork === false) {
      return;
    }

    let gzr;
    return new Promise((resolve, reject) => {
      this.GizerToken
        .deployed()
        .then(instance => {
          gzr = instance;
          const hex_string = this.web3.fromAscii(`I accept the Gizer Terms and Conditions
		  <---Terms and Conditions--->`).toString();
          this.web3.personal.sign(hex_string, this.account, (error, result) => {
            if (error) {
              reject({
                'failure': true
              });
            } else {
              this.signTransactionPending = this.signTransactionPending + 1;
              this.signTransactionPendingSubject.next(this.signTransactionPending);
              gzr.balanceOf(this.account)
                .then((value) => {
                  resolve({
                    'success': true,
                    'token': result,
                    'account': this.account,
                    'ammount': Number(value.toString()) / 1000000
                  });
                  this.refreshBalance();
                })
                .catch((err) => {
                  reject({ 'failure': true });
                });
            }
          });
        })
        .catch(e => {
          reject({ 'failure': true });
          this.setStatus('Error getting balance; see log.');
        });
    });
  }


  getTokenContract() {
    // if (this.validNetwork === false) {
    //   return;
    // }
    return this.GizerToken.deployed();
  }

  getStandardContract() {
    if (this.validNetwork === false) {
      return;
    }
    return this.GizerItems.deployed();
  }
  getItemGenerationContract() {
    if (this.validNetwork === false) {
      return;
    }
    return this.GizerItems.deployed();
  }

  getItemContract() {

    return this.GizerItems.deployed();
  }



  approveGZRSpending(amount) {
    let gzr;
    return new Promise((resolve, reject) => {
      this.getTokenContract()
        .then(ins => {
          gzr = ins;
          return this.getItemGenerationContract();
        })
        .then(instance => {
          return gzr.approve(instance.address, amount, { from: this.account, gas: 41000 });
        })
        .then(t => {
          resolve(t);
        })
        .catch(e => {
          this.setStatus('Error in GZR approval');
        });
    });
  }

  generateItem() {
    return new Promise((resolve, reject) => {
      this.getTokenContract()
        .then(instance => {
          return instance.buyItem.sendTransaction({
            from: this.account, gas: 280000, to: instance.address
          });
        })
        .then(tx => {
          this.treasureTransactionSubject.next(tx);
          resolve(tx);
        })
        .catch(e => {
          this.setStatus('Error in item generation');
          reject({ 'failure': true , 'message': e});
        });
    });
  }


  // watchMint(wallet) {
  //   return new Promise((resolve, reject) => {
  //     this.getTokenContract()
  //       .then(instance => {
  //         let event = instance.MintToken({wallet})



  //       })
  //       .catch(e => {
  //         this.setStatus('Error in watch mint');
  //         reject({ 'failure': true , 'message': e});
  //       });
  //   });
  // }

  // getReceipt(transactionID) {
  //   return new Promise((resolve, reject) => {
  //     this.web3.eth.getTransactionReceipt(transactionID, console.log(rr); 
  //     .then(res => {
  //       resolve(res);
  //     })
  //     .catch(e => {
  //       console.log('Error in receipt reception', e );
  //       reject({'failure': true});
  //     });
  //   });
  // }

  getTransactionReceipt(txHash, interval) {
    const transactionReceiptAsync = (resolve, reject) => {
      this.web3.eth.getTransactionReceipt(txHash, (error, receipt) => {
            if (error) {
                reject(error);
            } else if (receipt == null) {
                setTimeout(
                    () => transactionReceiptAsync(resolve, reject),
                    interval ? interval : 500);
            } else {
                resolve(receipt);
            }
        });
    };

    // if (Array.isArray(txHash)) {
    //     return Promise.all(txHash.map(
    //         oneTxHash => this.web3.eth.getTransactionReceiptMined(oneTxHash, interval)));
    // } else
     if (typeof txHash === "string") {
        return new Promise(transactionReceiptAsync);
    } else {
        throw new Error("Invalid Type: " + txHash);
    }
  };

  // getURI(idx) {
  //   return new Promise((resolve, reject) => {
  //     this.getItemContract()
  //     .then(instance => {
  //       return instance.deedUri.sendTransaction({
  //         from: this.account, gas: 277000, to: instance.address
  //       });
  //     })
  //     .catch(e => {
  //       console.log('Error in receipt reception', e );
  //       reject({'failure': true});
  //     });
  //   });
  // }

  get

}
