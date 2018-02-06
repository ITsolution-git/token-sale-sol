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
      this.bsModalRef = this.modalService.show(ProfileModalComponent, Object.assign({}, this.config, { class: 'gray modal-md' }));
    } else {
      this.navgiateToInstallMeta();
    }
  }

  navgiateToInstallMeta() {
    this.router.navigate(['/meta-mask']);
  }

  navgiateToTreasurePage() {
    const amount = 1;
    this.metaMaskService.sendCoin(amount);
  }
}
