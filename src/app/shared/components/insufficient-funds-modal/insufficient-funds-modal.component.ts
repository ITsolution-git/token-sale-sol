import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { ApplicationState } from '../../../store/application-state';
import { UserState } from '../../../store/store-data';
import { UPDATE_SHOW_ADDRESS_FORM } from '../../../store/actions/user.actions';

@Component({
  selector: 'app-insufficient-funds-modal',
  templateUrl: './insufficient-funds-modal.component.html',
  styleUrls: ['./insufficient-funds-modal.component.scss']
})
export class InsufficientFundsModalComponent implements OnInit {

  userState: Observable<UserState>;


  constructor(
    public bsModalRef: BsModalRef,
    private router: Router,
    private store: Store<ApplicationState>
  ) {
    this.userState = this.store.select('userState');
  }

  ngOnInit() {
  }

  navigateBuy() {
    this.bsModalRef.hide();
    this.router.navigate(['/buy-gzr']);
  }


}
