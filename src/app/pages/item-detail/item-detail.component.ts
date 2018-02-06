import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Item, Rarity } from '../../shared/models/item.model';
import { ItemService } from '../../shared/services/ItemService/item.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ParamMap } from '@angular/router/src/shared';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { title, shareImageUrl, viaUrl, hashTags } from './item-detail.meta';

declare const $: any;

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit {
  isMobile = false;
  items: Item[];
  detailItem$: Observable<Item>;
  detailItem: Item;
  itemArray: Item[];
  counter = 0;
  typeImages = [];

  // tslint:disable-next-line:max-line-length
  description = {
    title: title,
    img: shareImageUrl,
    via: viaUrl,
    hashtags: hashTags
  };
  constructor(
    private itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.isMobile = this.isMobileView();
    this.itemService.getItems().subscribe(res => {
      this.itemArray = res;
      if (this.isMobile) {
        this.items = res.slice(0, 4);
      } else {
        this.items = res.slice(0, 5);
      }

    });
    this.detailItem$ = this.route.paramMap
      .switchMap((params: ParamMap) => {
        window.scrollTo(0, 0);
        return this.itemService.getItem(params.get('id'));
      });
    this.detailItem$.subscribe(item => {
      this.detailItem = item;
      this.detailItem['safeUrl'] = this.addAutoStart(item.resources.videos[0]);
      this.setItemRarity(item.meta.rarity);
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
     this.isMobile = this.isMobileView();
     if (this.isMobile) {
      this.items = this.itemArray.slice(0, 4);
    } else {
      this.items = this.itemArray.slice(0, 5);
    }
  }

  isMobileView() {
    if ($(window).width() > 425) {
        return false;
    }
    return true;
  }

  setItemRarity(rarity: string) {
    const types = ['common', 'rare', 'insane', 'legendary', 'unfathomable'];
    let url = '';
    this.typeImages = [];
    types.map(type => {
      if (type.toLocaleLowerCase() === rarity.toLocaleLowerCase()) {
        url = `/assets/images/img-item-type-${type}.png`;
      } else {
        url = `/assets/images/img-item-type-${type}-disabled.png`;
      }
      this.typeImages.push(url);
    });
  }

  loadNextWeapons() {
    if (this.counter < this.itemArray.length - 5) {
      this.items = this.itemArray.slice(this.counter, this.counter + 5);
      this.counter += 1;
    }
  }

  navigateToTreasure() {
    this.router.navigate(['/open-treasure']);
  }

  addAutoStart(url): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url + '?autostart=1');
  }
}
