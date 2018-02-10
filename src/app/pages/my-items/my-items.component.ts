import { Component, OnInit, HostListener } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ItemService } from '../../shared/services/ItemService/item.service';
declare const $: any;

@Component({
  selector: 'app-my-items',
  templateUrl: './my-items.component.html',
  styleUrls: ['./my-items.component.scss']
})
export class MyItemsComponent implements OnInit {

  isMobile = false;
  unityPlayer: any = '';
  constructor(
    private itemService: ItemService,
    private domSanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.isMobile = this.isMobileView();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
     this.isMobile = this.isMobileView();
  }

  isMobileView() {
    if ($(window).width() > 425) {
        return false;
    }
    return true;
  }
  addAutoStart(url): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url + '?autostart=1');
  }
}
