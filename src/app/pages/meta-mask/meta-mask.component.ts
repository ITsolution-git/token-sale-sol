import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { ApplicationState } from '../../store/application-state';
import { UserState } from '../../store/store-data';

@Component({
  selector: 'app-meta-mask',
  templateUrl: './meta-mask.component.html',
  styleUrls: ['./meta-mask.component.scss']
})

export class MetaMaskComponent implements OnInit {
  userState: Observable<UserState>;
  installed = true;
  unlocked = true;

  constructor(
    private router: Router,
    private store: Store<ApplicationState>,
  ) {
    this.userState = this.store.select('userState');
   }

  ngOnInit() {
    this.userState.subscribe(state => {
      if (state) {
        this.installed = state.installed;
        this.unlocked = state.unlocked;
        if (this.installed && this.unlocked) {
          this.navigateToSaveAccount();
        }
      }
    });
  }

  navigateToSaveAccount() {
    this.router.navigate(['/save-account']);
  }

}
