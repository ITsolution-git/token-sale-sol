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
  isMobile = false;
  items: Item[];
  _items: Item[];
  counter = 0;
  limit = 10;
  page = 1;
  totalPage = 10;

  constructor(
    private itemService: ItemService,
  ) {
  }

  ngOnInit() {
    this.isMobile = this.isMobileView();
    this.itemService.getItems(this.limit, this.page).subscribe((res: Item[]) => {
      console.log(res);
      this.itemService.getItems_by_IDs(res[0].current.similar).subscribe((resp: Item[]) => {
        this._items = resp;
        this.items = this._items.slice(0, this.limit);
      });
    });
  }

  loadNextWeapons() {
    if (this._items.length > this.page * this.limit) {
      this.items = this._items.slice(this.page * this.limit, (this.page + 1) * this.limit);
      this.page += 1;
    }
  }

  loadPrevWeapons() {
    if (this.page > 1) {
      this.page -= 1;
      this.items = this._items.slice((this.page - 1) * this.limit, this.page * this.limit);
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
