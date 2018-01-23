import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../services/ItemService/item.service';
import { Item } from '../../models/item.model';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
  items: Item[];
  itemArray: Item[];
  counter = 0;
  constructor(
    private itemService: ItemService,
  ) {
  }

  ngOnInit() {
    this.itemService.getItems().subscribe((res: Item[]) => {
      this.itemArray = res;
      this.loadNextWeapons();
    });
  }

  loadNextWeapons() {
    if (this.counter < this.itemArray.length - 10) {
      this.items = this.itemArray.slice(this.counter, this.counter + 10);
      this.counter += 1;
    }
  }
}
