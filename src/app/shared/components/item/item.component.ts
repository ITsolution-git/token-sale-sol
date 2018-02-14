import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Rarity } from '../../models/item.model';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  @Input() id = '';
  @Input() itemImageLink = '';
  @Input() rarity = '';
  @Input() itemName = '';

  rarityType: string;
  itemId: string;
  constructor( private router: Router ) { }

  ngOnInit() {
    this.itemId = this.id;
    this.rarityType = `/assets/images/img-item-type-${this.rarity.toLocaleLowerCase()}.png`;
  }

  navigateToItemDetails() {
    this.router.navigate(['/item-detail', this.id]);
  }
}
