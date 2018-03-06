import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FaqComponent implements OnInit {
  status = {
    ggid: false,
    install: false,
    locked: false,
    ether: false,
    wallet: false,
    gizer: false,
    whatisggid: false,
    withitems: false,
    buy: false,
    selling: false,
    unlock: false,
    reach: false,
    ggiditem: false,
    founder: false,
    gzrtoken: false
  };

  constructor() {}

  ngOnInit() {
    this.eventTrack('viewed-faq-page', null);
  }

  stopCollapse(event: any) {
    event.stopPropagation();
  }

  eventTrack(event, metadata) {
    if (!(metadata)) {
      (<any>window).Intercom('trackEvent', event);
    } else {
      (<any>window).Intercom('trackEvent', event, metadata);
    }
    return true;
  }
}
