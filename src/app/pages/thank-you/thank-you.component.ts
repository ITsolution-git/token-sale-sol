import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { LocalStorageService } from 'ngx-webstorage';

import { MetaMaskService } from '../../shared/services/MetaMaskService/meta-mask.service';
import { ApplicationState } from '../../store/application-state';
import { UserService } from '../../shared/services/UserService/user.service';
import { UserState } from '../../store/store-data';
import { UPDATE_TRANSACTION_ID } from './../../store/actions/user.actions';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss']
})
export class ThankYouComponent implements OnInit {

  public transactionId: any;
  userState: Observable<UserState>;
  showSpinner = true;
  subscribed = false;
  saveUserIDStr = 'user_id';
  ethValueStr = 'purchasedEthValue';
  gzrValueStr = 'purchasedGZRValue';

  constructor(
    private metaMaskService: MetaMaskService,
    private localStorage: LocalStorageService,
    private router: Router,
    private store: Store<ApplicationState>,
    private userService: UserService
  ) {
    this.userState = this.store.select('userState');
  }

  ngOnInit() {
    this.metaMaskService.getAccountInfo();

    this.userState.subscribe(state => {
      if (state.transactionId !== '') {
        this.transactionId = state.transactionId;
        if (this.subscribed === false) {
          this.subscribed = true;
          const ethValue = this.localStorage.retrieve(this.ethValueStr),
              gzrValue = this.localStorage.retrieve(this.gzrValueStr);

          this.metaMaskService.checkTransactionStatus(this.transactionId)
          .then(res => {
            this.showSpinner = false;
            const metaData = {
              'transaction_id': res['transaction'],
              'ether_spent': ethValue,
              'gzr_received': gzrValue,
              'purchase_date': Math.ceil((new Date()).getTime() / 1000)
            };
            const customData =  {
              'purchased-gzr': true,
              gzr: gzrValue,
              eth: ethValue,
              last_purchased_at: Math.ceil((new Date()).getTime() / 1000)
            };
            this.eventTrack('purchased-gzr', metaData);
            this.updateUser(customData);
            this.updatePostBack(res['transaction'], gzrValue, ethValue, 'ETH', 'GZR');
            const txData = {
              'tx_id': res['transaction'],
              'eth': ethValue,
              'gzr': gzrValue ,
              'confirmed_at': Math.ceil((new Date()).getTime() / 1000)
            };
            this.saveUserTransaction(txData);
          }, err => {
            const customData =  {
              'purchased-gzr': false,
              gzr: 0,
              eth: 0
            };
            this.updateUser(customData);
          });
        }
      } else {
        this.navigateToBuyGzr();
      }
    });
  }

  navigateToBuyGzr() {
    this.router.navigate(['/buy-gzr']);
  }

  updateUser(customData) {
    (<any>window).Intercom('update', {
        custom_data: customData
    });
    return true;
  }

  eventTrack(event, metadata) {
    if (!(metadata)) {
      (<any>window).Intercom('trackEvent', event);
    } else {
      (<any>window).Intercom('trackEvent', event, metadata);
    }
    return true;
  }

  updatePostBack(afid, afprice, custom_field1, custom_field2, custom_field3) {
    let pixel = '';

    if (typeof afid !== 'undefined') {
      pixel += '&afid=' + afid;
    }

    if (typeof afprice !== 'undefined') {
      pixel += '&afprice=' + afprice;
    }

    pixel += '&custom_field1' + '=' +  custom_field1;
    pixel += '&custom_field2' + '=' +  custom_field2;
    pixel += '&custom_field3' + '=' +  custom_field3;

    pixel = pixel ? '?' + pixel.substr(1) : '';
    const img = document.createElement('img');
    img.src = '//gizer.icoref.link/success.php' + pixel;
    img.alt = '';
    img.style.cssText = 'position:absolute; top=-9999px; width:1px; height:1px; border:0';
    document.body.appendChild(img);
  }

  saveUserTransaction(txData) {
    const userId = this.localStorage.retrieve(this.saveUserIDStr);
    this.userService.saveTransaction(userId, txData).subscribe(res => { });
  }
}
