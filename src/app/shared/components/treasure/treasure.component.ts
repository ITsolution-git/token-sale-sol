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

import { ValidNetworkModalComponent } from '../valid-network/valid-network.component';
import { LockedModalComponent } from '../locked-modal/locked-modal.component';
import { InsufficientFundsModalComponent } from '../insufficient-funds-modal/insufficient-funds-modal.component';

import { OpeningTreasureModalComponent } from '../opening-treasure-modal/opening-treasure-modal.component';
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
  userState: Observable<UserState>;
  walletAddress: String;
  unlocked = false;
  gzrBalance: number;
  installed = false;
  validNetwork = true;

  buyPrice = 1;

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
    this.userState = this.store.select('userState');
  }

  ngOnInit() {
    this.eventTrack('viewed-open-treasure-page', null);
  }

  openTreasure() {
    this.userState.first().subscribe(state => {
      if (state) {
        this.walletAddress = state.walletAddress;
        this.unlocked = state.unlocked;
        this.gzrBalance = state.gzrBalance;
        this.installed = state.installed;
        this.validNetwork = state.validNetwork;

        if (this.installed === false) {
          this.router.navigate(['/meta-mask']);
        } else if (this.unlocked === false) {
          this.bsModalRef = this.modalService.show(LockedModalComponent,
            Object.assign({}, this.config, { class: 'gray modal-lg modal-center' }));
        } else if (this.validNetwork === false) {
          this.bsModalRef = this.modalService.show(ValidNetworkModalComponent,
            Object.assign({}, this.config, { class: 'gray modal-lg modal-center' }));
        } else {
          if (this.gzrBalance >= this.buyPrice) {
            this.metaMaskService.checkAndInstantiateWeb3().then(k => {
              setTimeout(() => {
                this.generateItemProcess();

              }, 1500);
            });
          } else {
            this.bsModalRef = this.modalService.show(InsufficientFundsModalComponent,
              Object.assign({}, this.config, { class: 'gray modal-lg modal-center' }));
          }
        }
      }
    });
  }


  generateItemProcess() {
    let chestID: string;
    let userID: string;
    let txID;

    this.chestService.createChest()
    .flatMap( c => {
      chestID = c.id;
      return this.userService.retrieveUser(this.walletAddress);
    })
    .flatMap(u => {
      userID = u[0].id;
      u[0].owns.push('Chest/' + chestID);
      const ownsData = {'owns': u[0].owns};
      this.userService.updateUser(userID, ownsData);
      return this.metaMaskService.generateItem();
    })
    .flatMap (tr => {
       this.router.navigate(['/generate-item']);
       txID = tr;
       return this.chestService.updateChest(chestID, {
          'status': 'pending',
          'user': userID,
          'transaction_id' : tr
      });
    })
    .flatMap (res => {
      return this.metaMaskService.getItemFromTransaction(txID, 1000);
    })
    .flatMap(item => {
      return this.chestService.updateChest(chestID, {'items': [item]});
    })
    .subscribe( res => {
      this.metaMaskService.refreshBalance();
      this.bsModalRef = this.modalService.show(OpeningTreasureModalComponent, Object.assign({}, this.config, { class: 'gray modal-lg' }));
      },
      error => {
        console.log(error);
      }
    );


    this.metaMaskService.treasureTransactionObservable$.subscribe(res => {
      const metadata = {
        'transaction-id': res,
        'item-id': '74143b3842ff373eb111d12f1f497611',
        price: this.buyPrice,
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
