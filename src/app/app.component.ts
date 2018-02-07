import { Component, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgSpinningPreloader } from 'ng2-spinning-preloader';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';

interface AppState {
  token: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements AfterViewInit {

  constructor(
    private store: Store<AppState>,
    private ngSpinningPreloader: NgSpinningPreloader,
    angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
    angulartics2GoogleTagManager: Angulartics2GoogleTagManager
  ) {

  }

  ngAfterViewInit() {
    this.ngSpinningPreloader.stop();
  }
}
