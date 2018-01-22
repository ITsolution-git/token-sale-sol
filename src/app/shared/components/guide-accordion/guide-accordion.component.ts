import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-guide-accordion',
  templateUrl: './guide-accordion.component.html',
  styleUrls: ['./guide-accordion.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GuideAccordionComponent implements OnInit {
  isFirstOpen: Boolean = true;
  status = {
    ggid: true,
    buy: false,
    install: false,
    locked: false,
    wallet: false,
    ether: false,
  };

  constructor( private router: Router ) { }

  ngOnInit() {
  }

  navigateToFAQ() {
    this.router.navigate(['/faq']);
  }

  stopCollapse(event: any) {
    event.stopPropagation();
  }
}
