import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  private fragment: string;
  constructor(
    private route: ActivatedRoute,
    meta: Meta,
    title: Title
    ) {
    title.setTitle('Homepage | Gizer Token Sale');

    meta.addTags([
      {
        name: 'description',
        content: `Immortalize your identity on the Ethereum blockchain. \
        Use GZR tokens to unlock scarce digital collectibles for your profile. \
        Compete in thousands and tournaments and create your eSports legacy.`
      },
      {
        property: 'og:image',
        content: 'http://api-dev.gizer.me/images/resource/5a9df8aa80e5f_og-image.png'
      }
    ]);
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
