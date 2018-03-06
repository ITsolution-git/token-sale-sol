import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemService } from '../../shared/services/ItemService/item.service';
import { Item } from '../../shared/models/item.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  items: Item[] = [];
  private fragment: string;
  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService,
  ) {
  }

  ngOnInit() {
    this.route.fragment.subscribe(fragment => {
      this.fragment = fragment;
      if (fragment === 'home') {
        window.scrollTo(0, 0);
      } else if (fragment === 'whatsgizer') {
        window.scrollTo(0, 1670);
      }
    });

    this.itemService.getItems().subscribe((res: Item[]) => {      
      this.itemService.getItems_by_IDs(res[0].current.similar).subscribe((resp: Item[]) => {        
        this.items = resp;
      });
    });
  }

  ngAfterViewInit() {
    try {
      document.querySelector('#' + this.fragment).scrollIntoView();
      window.scrollTo(0, window.scrollY - 123);
    } catch (e) { }
  }
}
