import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.scss']
})
export class PartnersComponent implements OnInit {

  constructor(
    meta: Meta,
    title: Title
  ) {
    title.setTitle('Partnerships | Gizer Token Sale');
  }


  ngOnInit() {
    this.eventTrack('viewed-partners-page', null);
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
