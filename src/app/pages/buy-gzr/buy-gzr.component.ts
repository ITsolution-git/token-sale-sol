import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-buy-gzr',
  templateUrl: './buy-gzr.component.html',
  styleUrls: ['./buy-gzr.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BuyGzrComponent implements OnInit {

  ethValue = 0.01;
  gzrValue = 10;
  constructor() { }

  ngOnInit() {
  }

  OnSliderChange(event) {
    this.ethValue = event.from;
    this.gzrValue = this.ethValue * 1000;
  }
}
