import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  private fragment: string;
  constructor(private route: ActivatedRoute) {
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
  }

  ngAfterViewInit() {
    try {
      document.querySelector('#' + this.fragment).scrollIntoView();
      window.scrollTo(0, window.scrollY - 123);
    } catch (e) { }
  }
}
