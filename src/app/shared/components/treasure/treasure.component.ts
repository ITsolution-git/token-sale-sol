import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { ApplicationState } from '../../../store/application-state';
import { UserState } from '../../../store/store-data';
import { MetaMaskService } from '../../services/MetaMaskService/meta-mask.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ProfileModalComponent } from '../profile-modal/profile-modal.component';
import { WaitingTreasureModalComponent } from '../waiting-treasure-modal/waiting-treasure-modal.component';
import { WaitingItemComponent } from '../waiting-item/waiting-item.component';

@Component({
  selector: 'app-treasure',
  templateUrl: './treasure.component.html',
  styleUrls: ['./treasure.component.scss']
})
export class TreasureComponent implements OnInit {
  userState: Observable<UserState>;
  walletAddress: String;
  unlocked = false;
  balance: number;
  installed = false;
  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: false
  };
  tokenContract: {};
  standardContract: {};
  itemGenerationContract: {};


  bsModalRef: BsModalRef;


  constructor(
    private router: Router,
    private store: Store<ApplicationState>,
    private metaMaskService: MetaMaskService,
    private modalService: BsModalService,
  ) {
    this.userState = this.store.select('userState');
  }

  ngOnInit() {
    this.metaMaskService.getAccountInfo();

    this.userState.subscribe(state => {
      if (state) {
        this.walletAddress = state.walletAddress;
        this.unlocked = state.unlocked;
        this.balance = state.balance;
        this.installed = state.installed;
      }
    });
  }

  openTreasure() {
    if (this.unlocked && this.installed) {
      this.openTreasureModal();
    } else {
      this.navigateToInstallMeta();
    }
  }

  navigateToInstallMeta() {
    this.router.navigate(['/meta-mask']);
  }

  openTreasureModal() {
    const amount = 1;



    this.metaMaskService.getTokenContract()
      .then(ctc => {
        this.tokenContract = ctc;
        this.metaMaskService.approveTokenSend(this.tokenContract, amount)
        this.metaMaskService.getItemGenerationContract()
          .then(ctr => {
            this.itemGenerationContract = ctr;
            this.metaMaskService.getItem(this.itemGenerationContract);
            this.bsModalRef = this.modalService.show(WaitingItemComponent);
          });
      });
  }
}
