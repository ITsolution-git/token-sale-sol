import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { LockedModalComponent } from '../../shared/components/locked-modal/locked-modal.component';
import { InstallMaskModalComponent } from '../../shared/components/install-mask-modal/install-mask-modal.component';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { ApplicationState } from '../../store/application-state';
import { UserState } from '../../store/store-data';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { MetaMaskService } from '../../shared/services/MetaMaskService/meta-mask.service';
import { UPDATE_TRANSACTION_ID } from './../../store/actions/user.actions';
import * as Moment from 'moment';

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

  isFromModal = false;
  isMobile = false;
  isBuyClicked = false;

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
    private store: Store<ApplicationState>
  ) {
    this.userState = this.store.select('userState');
  }

  ngOnInit() {
    this.isMobile = this.isMobileView();
    this.eventTrack('viewed-buy-gzr-page', null);
    if (this.isMobile) {
      this.installed = false;
      this.unlocked = false;
      this.bsModalRef = this.modalService.show(LockedModalComponent, Object.assign({}, this.config, { class: 'gray modal-lg' }));
    } else {
      this.userState.subscribe(state => {
        if (state) {
          this.event$.next(state);
        }
      });
      this.metaMaskService.getAccountInfo();
      this.metaMaskService.installedObservable$.take(1).subscribe(status => {
        this.installed = status;
        if (!status) {
          this.bsModalRef = this.modalService.show(InstallMaskModalComponent, Object.assign({}, this.config, { class: 'gray modal-lg' }));
        }
        this.metaMaskService.unloadAccountInfo();
      });
      this.metaMaskService.getAccountInfo();
      this.metaMaskService.unlockedObservable$.take(1).subscribe(status => {
        this.unlocked = status;
        if (!status) {
          this.bsModalRef = this.modalService.show(LockedModalComponent, Object.assign({}, this.config, { class: 'gray modal-lg' }));
        }
        this.metaMaskService.unloadAccountInfo();
      });

      this.eventSource.debounceTime(300).subscribe(state => {
        this.isFromModal = state.showAddressForm;
      });

      this.event$.subscribe((state) => {
        this.installed = state.installed;
        this.unlocked = state.unlocked;
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

  openModalWithComponent() {
    if (!this.isAccepted) {
      this.isBuyClicked = true;
    } else {
      if (!this.installed) {
        this.bsModalRef = this.modalService.show(InstallMaskModalComponent, Object.assign({}, this.config, { class: 'gray modal-lg' }));
      } else if (!this.unlocked) {
        this.bsModalRef = this.modalService.show(LockedModalComponent, Object.assign({}, this.config, { class: 'gray modal-lg' }));
      } else {
        const meta = {
          amount: this.gzrValue,
        };
        this.eventTrack('purchased-gzr', meta);
        this.metaMaskService.TransferEthToBuyGzr(this.ethValue, this.gzrValue)
        .then((res) => {
          if (res['success']) {
            this.updateTransactionId(res['transaction']);
            setTimeout(() => {
              // Track Event with Intercom
              const metadata = {
                'transaction-id': res['transaction'],
                ether_spent: this.ethValue,
                gzr_purchased: this.gzrValue,
                purchased_at: Moment().unix(),
              };
              const customData =  {
                purchased_gzr: this.gzrValue,
                last_purchased_at: Moment().unix(),
                total_gzr_purchased: this.gzrValue,
                total_ether_spent: this.ethValue
              };
              this.eventTrack('purchased-gzr', metadata);
              this.updateUser(customData);
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
