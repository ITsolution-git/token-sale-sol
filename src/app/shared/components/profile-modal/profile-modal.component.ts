import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { ApplicationState } from '../../../store/application-state';
import { UserState } from '../../../store/store-data';
import { UPDATE_SHOW_ADDRESS_FORM } from '../../../store/actions/user.actions';

declare const $: any;

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.scss']
})

export class ProfileModalComponent implements OnInit {

  userState: Observable<UserState>;
  isMobile = false;

  title: string;
  closeBtnName: string;
  list: any[] = [];

  constructor(
    public bsModalRef: BsModalRef,
    private router: Router,
    private store: Store<ApplicationState>
  ) {
    this.userState = this.store.select('userState');
  }

  ngOnInit() {
    this.isMobile = this.isMobileView();
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

  closeModal() {
    this.bsModalRef.hide();
  }


}
