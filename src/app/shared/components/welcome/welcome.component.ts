import { Component, OnInit, Input, HostListener } from '@angular/core';

declare const $: any;

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})

export class WelcomeComponent implements OnInit {
  isMobile = false;

  constructor() { }

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
}
