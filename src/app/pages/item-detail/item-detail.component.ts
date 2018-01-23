import { Component, OnInit } from '@angular/core';
import { Item } from '../../shared/models/item.model';
import { ItemService } from '../../shared/services/ItemService/item.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ParamMap } from '@angular/router/src/shared';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit {
  items: Item[];
  detailItem$: Observable<Item>;
  detailItem: Item;
  constructor(
    private itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.itemService.getItems().subscribe(res => {
      this.items = res.slice(0, 5);
    });
    this.detailItem$ = this.route.paramMap
      .switchMap((params: ParamMap) => this.itemService.getItem(params.get('id')));
    this.detailItem$.subscribe(item => this.detailItem = item);
  }
}
