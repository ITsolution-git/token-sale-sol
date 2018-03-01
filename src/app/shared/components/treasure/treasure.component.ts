import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Store } from '@ngrx/store';
import { ApplicationState } from '../../../store/application-state';
import { UserState } from '../../../store/store-data';

import { MetaMaskService } from '../../services/MetaMaskService/meta-mask.service';
import { ChestService } from '../../services/ChestService/chest.service';
import { ItemService } from '../../services/ItemService/item.service';
import { UserService } from '../../services/UserService/user.service';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ProfileModalComponent } from '../profile-modal/profile-modal.component';

import { ValidNetworkModalComponent } from '../valid-network/valid-network.component';
import { LockedModalComponent } from '../locked-modal/locked-modal.component';
import { LocalStorageService } from 'ngx-webstorage';

export interface TransactionReceipt {
  tx: string;
  transactionIndex: number;
  blockHash: string;
  blockNumber: number;
}


@Component({
  selector: 'app-treasure',
  templateUrl: './treasure.component.html',
  styleUrls: ['./treasure.component.scss']
})
export class TreasureComponent implements OnInit {
  userState$: Observable<UserState>;
  GZRInstance$: Observable<any>;
  ItemsInstance$: Observable<any>;

  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: false,
  };



  bsModalRef: BsModalRef;

  constructor(
    private router: Router,
    private store: Store<ApplicationState>,
    private metaMaskService: MetaMaskService,
    private modalService: BsModalService,
    private localStorage: LocalStorageService,
    private userService: UserService,
    private itemService: ItemService,
    private chestService: ChestService,

  ) {
    this.userState$ = this.store.select('userState');
  }

  ngOnInit() {
    this.eventTrack('viewed-open-treasure-page', null);
    this.metaMaskService.getAccountInfo();
  }

  openTreasure() {
    this.userState$.first().subscribe(state => {
      if (state.unlocked && state.installed && state.validNetwork) {
        this.sendTransactions();
      } else if (state.installed === false) {
        this.router.navigate(['/meta-mask']);
      } else if (state.unlocked === false) {
        this.bsModalRef = this.modalService.show(LockedModalComponent,
          Object.assign({}, this.config, { class: 'gray modal-lg modal-center' }));
      } else if (state.validNetwork === false) {
        this.bsModalRef = this.modalService.show(ValidNetworkModalComponent,
          Object.assign({}, this.config, { class: 'gray modal-lg modal-center' }));
      }
    });
  }

  sendTransactions() {
    const amount = 1;
    let chestID: string;
    let userID: string;

    this.metaMaskService.approveGZRSpending(amount)
    .then(res => {
    })
    .catch((error) => {
    });

    this.chestService.createChest()
    .flatMap( c => {
      chestID = c.id;
      return this.userState$;
    })
    .flatMap( usr => {
      return this.userService.retrieveUser(usr.walletAddress);

    })
    .flatMap(u => {
      userID = u[0].id;
      if (u[0].owns[u[0].owns.length] !== 'chest/' + chestID) {
        u[0].owns.push('chest/' + chestID);
      }
      return this.userService.updateUser(userID, {'owns': u[0].owns});
    })
    .flatMap( o => {
      return this.metaMaskService.generateItem();
    })
    .subscribe(tr => {
      this.router.navigate(['/generate-item']);
      return this.chestService.updateChest(chestID, userID, tr );
    });

    this.metaMaskService.treasureTransactionObservable$.subscribe(res => {
      const metadata = {
        'transaction-id': res,
        'item-id': '74143b3842ff373eb111d12f1f497611',
        price: amount,
        opened_date: Math.ceil((new Date()).getTime() / 1000),
      };
      const customData = {
        opened_treasure: true,
        items_owned: 1,
        last_opened_treasure_at: Math.ceil((new Date()).getTime() / 1000),
      };
      this.updateUser(customData);
      this.eventTrack('opened-treasure', metadata);
    },
    error => {
      if (error) {
        const customData = {
          opened_treasure: false,
          items_owned: 0
        };
        this.updateUser(customData);
      }
    });

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
}
