import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { LockedModalComponent } from '../../shared/components/locked-modal/locked-modal.component';
import { InstallMaskModalComponent } from '../../shared/components/install-mask-modal/install-mask-modal.component';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { ApplicationState } from '../../store/application-state';
import { UserState } from '../../store/store-data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buy-gzr',
  templateUrl: './buy-gzr.component.html',
  styleUrls: ['./buy-gzr.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BuyGzrComponent implements OnInit {

  ethValue = 0.01;
  gzrValue = 10;
  isAccepted = false;
  showAddress = false;

  userState: Observable<UserState>;
  installed = true;
  unlocked = true;

  isFromModal = false;

  bsModalRef: BsModalRef;

  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: false
  };

  constructor(
    private modalService: BsModalService,
    private router: Router,
    private store: Store<ApplicationState>
  ) {
    this.userState = this.store.select('userState');
  }

  ngOnInit() {
    this.userState.subscribe(state => {
      if (state) {
        this.installed = state.installed;
        this.unlocked = state.unlocked;
        this.isFromModal = state.showAddressForm;
      }
    });
  }

  OnSliderChange(event) {
    this.ethValue = event.from;
    this.gzrValue = this.ethValue * 1000;
  }

  openModalWithComponent() {
    if (!this.isAccepted) {
      console.log('you need to accept terms & conditions first');
    } else {
      if (!this.installed) {
        this.bsModalRef = this.modalService.show(InstallMaskModalComponent, Object.assign({}, this.config, { class: 'gray modal-lg' }));
      } else if (!this.unlocked) {
        this.bsModalRef = this.modalService.show(LockedModalComponent, Object.assign({}, this.config, { class: 'gray modal-lg' }));
      } else {
        this.router.navigate(['/thank-you']);
      }
    }
  }

  showAddressForm() {
    if (this.isAccepted) {
      this.showAddress = true;
    }
  }
}
