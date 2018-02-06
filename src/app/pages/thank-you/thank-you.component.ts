import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MetaMaskService } from '../../shared/services/MetaMaskService/meta-mask.service';
import { ApplicationState } from '../../store/application-state';
import { UserState } from '../../store/store-data';
import { UPDATE_TRANSACTION_ID } from './../../store/actions/user.actions';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss']
})
export class ThankYouComponent implements OnInit {

  private transactionId: any;
  userState: Observable<UserState>;

  constructor(
    private metaMaskService: MetaMaskService,
    private router: Router,
    private store: Store<ApplicationState>
  ) {
    this.userState = this.store.select('userState');
  }

  ngOnInit() {
    this.metaMaskService.getAccountInfo();

    this.userState.subscribe(state => {
      if (state.transactionId !== '') {
        this.transactionId = state.transactionId;
      } else {
        this.navigateToBuyGzr();
      }
    });
  }

  navigateToBuyGzr() {
    this.router.navigate(['/buy-gzr']);
  }
}
