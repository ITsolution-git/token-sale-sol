import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../../core/services/ItemService/item.service';
import { Item } from '../../models/item.module';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
  items: Item[];
  constructor(
    private itemService: ItemService,
  ) { }

  ngOnInit() {
    this.itemService.getItems().subscribe(res => {
      this.items = res;
    });
  }

}
