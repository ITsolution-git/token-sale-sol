import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  @Input() index: Number = 0;
  @Input() itemImageLink: String = '';

  private colorArray = ['#458fe7', '#ffffff', '#e06d56', '#f2a924', '#62eac7'];

  constructor() { }

  ngOnInit() {
  }

}
