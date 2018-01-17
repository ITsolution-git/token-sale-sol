import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  @Input() index = 0;
  @Input() itemImageLink = '';
  @Input() showButton = true;
  @Input() itemName = '';
  constructor( private router: Router ) { }

  ngOnInit() {
  }

  navigateToItemDetails() {
    this.router.navigate(['/item-detail']);
  }
}
