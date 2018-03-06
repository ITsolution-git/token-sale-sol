import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ItemService } from '../../services/ItemService/item.service';
import { Item } from '../../models/item.model';

declare const $: any;

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})

export class ItemListComponent implements OnInit {
  @Input() showTitle = true;
  @Input() showNavigation = true;
  @Input() itemCountToShow = 10;
  @Input() showMine = false;
  isMobile = false;
  _items: Item[];
  counter = 0;
  limit = 10;
  page = 1;
  totalPage = 10;

  constructor(
    private itemService: ItemService,
  ) {
  }

  get items(): Item[] {
    // transform value for display
    return this._items.slice((this.page - 1) * this.limit, this.page * this.limit);
  }

  @Input()
  set items(items: Item[]) {
    this._items = items;
  }

  ngOnInit() {
    this.isMobile = this.isMobileView();    
  }

  loadNextWeapons() {
    if (this._items.length > this.page * this.limit) {
      this.page += 1;
    }
  }

  loadPrevWeapons() {
    if (this.page > 1) {
      this.page -= 1;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
     this.isMobile = this.isMobileView();
  }

  isMobileView() {
    if ($(window).width() > 425) {
        return false;
    }
    return true;
  }

}
