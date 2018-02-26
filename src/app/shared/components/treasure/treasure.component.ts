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
import { WaitingTreasureModalComponent } from '../waiting-treasure-modal/waiting-treasure-modal.component';

import { ValidNetworkModalComponent } from '../valid-network/valid-network.component';
import { LockedModalComponent } from '../locked-modal/locked-modal.component';
import { OpeningTreasureModalComponent } from '../opening-treasure-modal/opening-treasure-modal.component';
import { LocalStorageService } from 'ngx-webstorage';

export interface TransactionReceipt {
  tx: string
  transactionIndex: number
  blockHash: string
  blockNumber: number
}


@Component({
  selector: 'app-treasure',
  templateUrl: './treasure.component.html',
  styleUrls: ['./treasure.component.scss']
})
export class TreasureComponent implements OnInit {
  userState: Observable<UserState>;
  GZRInstance$: Observable<any>;
  ItemsInstance$: Observable<any>;
  walletAddress: String;
  unlocked = false;
  balance: number;
  installed = false;
  validNetwork = true;

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
    this.metaMaskService.getAccountInfo();

    this.userState.subscribe(state => {
      if (state) {
        this.walletAddress = state.walletAddress;
        this.unlocked = state.unlocked;
        this.balance = state.balance;
        this.installed = state.installed;
        this.validNetwork = state.validNetwork;
      }
    });

  }

  openTreasure() {
    if (this.unlocked && this.installed && this.validNetwork) {
      this.openTreasureModal();
    } else if (this.installed === false ) {
      this.navigateToInstallMeta();
    } else if (this.unlocked === false ) {
      this.showModal();
    } else if (this.validNetwork === false) {
      this.showModal();
    }
  }

  showModal() {
    if (this.unlocked === false) {
      this.bsModalRef = this.modalService.show(LockedModalComponent,
        Object.assign({}, this.config, { class: 'gray modal-lg modal-center' }));
    }

    if (this.validNetwork === false) {
      this.bsModalRef = this.modalService.show(ValidNetworkModalComponent,
        Object.assign({}, this.config, { class: 'gray modal-lg modal-center' }));
    }
  }

  navigateToInstallMeta() {
    this.router.navigate(['/meta-mask']);
  }

  openTreasureModal() {
    const amount = 1;
    let chestID : string;
    let userID: string;
    let owns: string[]= [];
    
    this.metaMaskService.approveGZRSpending(amount)
    .then(res => {
    })
    .catch((error) => {
    });
    
    this.chestService.createChest()
    .flatMap( c => {
      console.log("chest ", c);
      chestID = c.id;
      return  this.userService.retrieveUser(this.walletAddress)
    })
    .flatMap(u => {
      userID = u[0].id;
      owns = u[0].owns;
      console.log("user ", u);
      console.log("owns", owns);
      console.log("id", userID);

      return this.metaMaskService.generateItem()
    })
    .flatMap( (tr) => {
      console.log("from generate item ",tr);
      this.router.navigate(['/generate-item']);
      return this.chestService.updateChest(chestID,userID,tr)
    })
    .subscribe( c => {
      owns[owns.length] = chestID;
      this.userService.updateUserOwnership(userID,owns);
    })
    
    this.metaMaskService.treasureTransactionObservable$.subscribe(res => {
      const metadata = {
        'transaction-id': res,
        'item-id': '74143b3842ff373eb111d12f1f497611',
        price: amount,
        opened_at: (new Date()).getTime(),
      };
      const customData =  {
        opened_treasure: true,
        items_owned: 1,
        last_opened_treasure_at: (new Date()).getTime(),
      };
      this.updateUser(customData);
      this.eventTrack('opened-treasure', metadata);
    }) 

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
