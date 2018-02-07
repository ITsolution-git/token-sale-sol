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
  @Input() itemCountToShow = 10;
  isMobile = false;
  items: Item[];
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
      if (res.length !== 0) {
        this.items = res;
      }
    });
  }

  loadNextWeapons() {
    const nextPage = this.page + 1;
    if (this.totalPage >= nextPage) {
      this.itemService.getItems(this.limit, nextPage).subscribe((res: Item[]) => {
        if (res.length !== 0) {
          this.items = res;
          this.page += 1;
        } else {
          this.totalPage = this.page;
        }
      });
    }
  }

  loadPrevWeapons() {
    if (this.page > 1) {
      const prevPage = this.page - 1;
      this.itemService.getItems(this.limit, prevPage).subscribe((res: Item[]) => {
        if (res.length !== 0) {
          this.items = res;
          this.page -= 1;
        }
      });
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
