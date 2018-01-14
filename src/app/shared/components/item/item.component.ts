import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  @Input() index: Number = 0;
  @Input() itemImageLink: String = '';
  @Input() showButton = true;

  private colorArray = ['#458fe7', '#ffffff', '#e06d56', '#f2a924', '#62eac7'];

  constructor( private router: Router ) { }

  ngOnInit() {
  }

  navigateToItemDetails() {
    this.router.navigate(['/item-detail']);
  }
}
