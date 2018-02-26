import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { LockedModalComponent } from '../../shared/components/locked-modal/locked-modal.component';
import { InstallMaskModalComponent } from '../../shared/components/install-mask-modal/install-mask-modal.component';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { LocalStorageService } from 'ngx-webstorage';

import { ApplicationState } from '../../store/application-state';
import { UserState } from '../../store/store-data';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { ValidNetworkModalComponent } from '../../shared/components/valid-network/valid-network.component';
import { MetaMaskService } from '../../shared/services/MetaMaskService/meta-mask.service';
import { UPDATE_TRANSACTION_ID } from './../../store/actions/user.actions';

declare const $: any;

@Component({
  selector: 'app-buy-gzr',
  templateUrl: './buy-gzr.component.html',
  styleUrls: ['./buy-gzr.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BuyGzrComponent implements OnInit {

  ethValue = 0.01;
  slideValue = 0.01;
  gzrValue = 10;
  minValue = 0.01;
  maxValue = 500;
  cashRate = 1000;

  isAccepted = false;
  showAddress = false;

  userState: Observable<UserState>;
  installed = true;
  unlocked = true;
  validNetwork = true;

  isFromModal = false;
  isMobile = false;
  isBuyClicked = false;
  ethValueStr = 'purchasedEthValue';
  gzrValueStr = 'purchasedGZRValue';
  saveUserIDStr = 'user_id';

  bsModalRef: BsModalRef;

  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: false
  };

  event$: Subject<any> = new Subject<any>();
  eventSource: Observable<any> = this.event$.asObservable();

  constructor(
    private modalService: BsModalService,
    private router: Router,
    private metaMaskService: MetaMaskService,
    private localStorage: LocalStorageService,
    private store: Store<ApplicationState>
  ) {
    this.userState = this.store.select('userState');
    this.metaMaskService.getAccountInfo();
    this.userState.subscribe(state => {
      if (state) {
        this.installed = state.installed;
        if (state.installed === null) {
          this.metaMaskService.unloadAccountInfo();
          this.metaMaskService.getAccountInfo();
        } else {
          this.unlocked = state.unlocked;
          this.validNetwork = state.validNetwork;
          this.showInstalledModal();
        }
      }
    });
  }

  ngOnInit() {
    this.isMobile = this.isMobileView();
    this.eventTrack('viewed-buy-gzr-page', null);

    const userId = this.localStorage.retrieve(this.saveUserIDStr);
    if (!userId) {
      this.router.navigate(['/save-account']);
    }

    if (this.isMobile) {
      this.installed = false;
      this.unlocked = false;
      this.bsModalRef = this.modalService.show(LockedModalComponent, Object.assign({}, this.config, { class: 'gray modal-lg' }));
    } else {
      this.metaMaskService.installedObservable$.take(1).subscribe(status => {
        this.installed = status;
        this.metaMaskService.unloadAccountInfo();
      });
      this.metaMaskService.getAccountInfo();
      this.metaMaskService.unlockedObservable$.take(1).subscribe(status => {
        this.unlocked = status;
        this.metaMaskService.unloadAccountInfo();
      });
      this.metaMaskService.getAccountInfo();
      this.metaMaskService.validNetworkObservable$.subscribe(status => {
        if (this.validNetwork !== status) {
          this.validNetwork = status;
        }
        this.metaMaskService.unloadAccountInfo();
      });

      this.eventSource.debounceTime(300).subscribe(state => {
        this.isFromModal = state.showAddressForm;
      });

    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
     this.isMobile = this.isMobileView();
  }

  isMobileView() {
    if ($(window).width() > 425) {
        return false;
    }
    return true;
  }

  OnSliderChange(event) {
    const sliderValue = event.from;
    if (sliderValue < this.minValue) {
      this.ethValue = this.minValue;
      this.gzrValue = this.ethValue * this.cashRate;
    } else {
      this.ethValue = event.from;
      this.gzrValue = this.ethValue * this.cashRate;
    }
  }

  showInstalledModal() {
    if (this.installed === false && !this.bsModalRef) {
      this.bsModalRef = this.modalService.show(InstallMaskModalComponent,
        Object.assign({}, this.config, { class: 'gray modal-lg' }));
    }

    if (this.unlocked === false && !this.bsModalRef) {
      this.bsModalRef = this.modalService.show(LockedModalComponent,
        Object.assign({}, this.config, { class: 'gray modal-lg modal-center' }));
    }
  }

  openModalWithComponent() {
    if (!this.isAccepted) {
      this.isBuyClicked = true;
    } else {
      if (!this.installed) {
        this.bsModalRef = this.modalService.show(InstallMaskModalComponent,
          Object.assign({}, this.config, { class: 'gray modal-lg' }));
      } else if (!this.unlocked) {
        this.bsModalRef = this.modalService.show(LockedModalComponent,
          Object.assign({}, this.config, { class: 'gray modal-lg modal-center' }));
      } else if (!this.validNetwork) {
        this.bsModalRef = this.modalService.show(ValidNetworkModalComponent,
          Object.assign({}, this.config, { class: 'gray modal-lg modal-center' }));
      } else {
        const meta = {
          amount: this.gzrValue,
        };
        this.eventTrack('purchased-gzr', meta);
        this.metaMaskService.TransferEthToBuyGzr(this.ethValue, this.gzrValue)
        .then((res) => {
          if (res['success'] === true) {
            this.updateTransactionId(res['transaction']);
            setTimeout(() => {
              this.localStorage.store(this.ethValueStr, this.ethValue);
              this.localStorage.store(this.gzrValueStr, this.gzrValue);
              this.router.navigate(['/thank-you']);
            }, 1000);
          }
        })
        .catch((error) => {
        });
      }
    }
  }

  showAddressForm() {
    if (this.isAccepted) {
      this.showAddress = true;
    }
  }

  updateTransactionId(data) {
    this.store.dispatch({type: UPDATE_TRANSACTION_ID, payload: data});
  }

  updateSliderValue(value) {
    if (value > this.maxValue) {
      this.ethValue = this.maxValue;
    } else if (value < this.minValue) {
      this.ethValue = this.minValue;
    }
    this.slideValue = this.ethValue;
    this.gzrValue = this.ethValue * this.cashRate;
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
