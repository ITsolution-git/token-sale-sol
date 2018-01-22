import { Component, OnInit } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
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
    private spinnerService: Ng4LoadingSpinnerService
  ) { }

  ngOnInit() {
    this.spinnerService.show();
    this.itemService.getItems().subscribe(res => {
      this.items = res;
      this.spinnerService.hide();
    });
  }

}
