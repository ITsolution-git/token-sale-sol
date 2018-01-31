import { Component, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgSpinningPreloader } from 'ng2-spinning-preloader';

interface AppState {
  token: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements AfterViewInit {

  constructor(private store: Store<AppState>, private ngSpinningPreloader: NgSpinningPreloader) {

  }

  ngAfterViewInit() {
  	this.ngSpinningPreloader.stop()
  }
}
