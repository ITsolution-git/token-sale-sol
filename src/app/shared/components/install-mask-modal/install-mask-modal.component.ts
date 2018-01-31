import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { ApplicationState } from '../../../store/application-state';
import { UserState } from '../../../store/store-data';
import { UPDATE_SHOW_ADDRESS_FORM } from '../../../store/actions/user.actions';

@Component({
  selector: 'app-install-mask-modal',
  templateUrl: './install-mask-modal.component.html',
  styleUrls: ['./install-mask-modal.component.scss']
})
export class InstallMaskModalComponent implements OnInit {

  userState: Observable<UserState>;

  constructor(
    private router: Router,
    private bsModalRef: BsModalRef,
    private store: Store<ApplicationState>
  ) {
    this.userState = this.store.select('userState');
  }

  ngOnInit() {}

  navigateToFAQ() {
    this.bsModalRef.hide();
    this.router.navigate(['/faq']);
  }

  showAddressForm() {
    this.bsModalRef.hide();
    this.updateShowAddressForm(true);
  }

  updateShowAddressForm(data) {
    this.store.dispatch({type: UPDATE_SHOW_ADDRESS_FORM, payload: data});
  }
}
