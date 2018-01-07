import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
  itemImageLink = [
    '/assets/images/item-mask.png',
    '/assets/images/item-shot.png',
    '/assets/images/item-knife.png',
    '/assets/images/item-umbrella.png',
    '/assets/images/item-lamp.png'
  ];
  constructor() { }

  ngOnInit() {
  }

}
