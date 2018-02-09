import { Component, OnInit, HostListener } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ItemService } from '../../shared/services/ItemService/item.service';

const unityProgress = UnityProgress;
const unityLoader = UnityLoader;

declare const $: any;

@Component({
  selector: 'app-my-items',
  templateUrl: './my-items.component.html',
  styleUrls: ['./my-items.component.scss']
})
export class MyItemsComponent implements OnInit {
  projectURL = './../../../assets/externals/unity-player/Build/Project.json';
  container = 'gameContainer';
  isMobile = false;
  gameInstance: any;
  unityPlayer: any = '';
  constructor(
    private itemService: ItemService,
    private domSanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.isMobile = this.isMobileView();
    console.log(unityLoader);
    this.gameInstance = UnityLoader.instantiate(this.container, this.projectURL, {onProgress: unityProgress});
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
}
