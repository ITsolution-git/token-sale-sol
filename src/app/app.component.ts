import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

interface AppState {
  token: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  constructor(private store: Store<AppState>) {

  }
}
