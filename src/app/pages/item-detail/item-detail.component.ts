import { Component, OnInit } from '@angular/core';
import { Item } from '../../shared/models/item.module';
import { ItemService } from '../../shared/services/ItemService/item.service';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit {
  items: Item[];
  constructor(
    private itemService: ItemService
  ) { }

  ngOnInit() {
    this.itemService.getItems().subscribe(res => {
      this.items = res.slice(0, 5);
    });
  }
}
