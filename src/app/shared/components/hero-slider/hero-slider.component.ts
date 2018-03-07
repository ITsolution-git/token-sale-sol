import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { Router } from '@angular/router';

declare const $: any;

@Component({
  selector: 'app-hero-slider',
  templateUrl: './hero-slider.component.html',
  styleUrls: ['./hero-slider.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class HeroSliderComponent implements OnInit {

  isMobile = false;
  routeToBuyGzr = '/buy-gzr';
  slides = [
    {imgUrl: '/assets/images/banner-1.jpg'},
    {imgUrl: '/assets/images/banner-2.jpg'},
    {imgUrl: '/assets/images/banner-3.jpg'},
  ];

  slideConfig = {
    'slidesToShow': 1,
    'infinite': true,
    'arrows': true,
    'dots': true,
    'centerMode': true,
    'fade': true,
    'autoplay': true,
    'autoplaySpeed': 5000,
  };

  mobileSlideConfig = {
    'slidesToShow': 1,
    'infinite': true,
    'arrows': false,
    'dots': false,
    'centerMode': true,
    'fade': true,
    'autoplay': true,
    'autoplaySpeed': 5000,
  };

  constructor(
    private router: Router,
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

  navigateToBuyGzr() {
    this.router.navigate([this.routeToBuyGzr]);
  }
}
