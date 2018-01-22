import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { ApplicationState } from '../../../store/application-state';
import { UserState } from '../../../store/store-data';
import { MetaMaskService } from '../../services/MetaMaskService/meta-mask.service';


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

  constructor(
    private router: Router,
    private store: Store<ApplicationState>,
    private metaMaskService: MetaMaskService,
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
      this.navgiateToTreasurePage();
    } else {
      this.navgiateToInstallMeta();
    }
  }

  navgiateToInstallMeta() {
    this.router.navigate(['/meta-mask']);
  }

  navgiateToTreasurePage() {
    const amount = 20;
    const receiver = '0xc07b70A89aD5c4109777825aDE6dDD36Bb91A949';
    this.metaMaskService.sendCoin(amount, receiver);
  }
}
