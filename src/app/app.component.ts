import { Component, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgSpinningPreloader } from 'ng2-spinning-preloader';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';
import { Meta, Title } from '@angular/platform-browser';

interface AppState {
  registered: false;
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
    angulartics2GoogleTagManager: Angulartics2GoogleTagManager,
    meta: Meta,
    title: Title
  ) {
    title.setTitle('The Global Gaming Identity | Gizer Token Sale');

    meta.addTags([
      {
        name: 'description',
        content: `Immortalize your identity on the Ethereum blockchain. \
        Use GZR tokens to unlock scarce digital collectibles for your profile. \
        Compete in thousands and tournaments and create your eSports legacy.` },
      {
        property: 'og:image',
        content: 'http://api-dev.gizer.me/images/resource/5a9df8aa80e5f_og-image.png'
      }
    ]);
  }

  ngAfterViewInit() {
    this.ngSpinningPreloader.stop();
  }
}
