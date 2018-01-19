import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-hero-slider',
  templateUrl: './hero-slider.component.html',
  styleUrls: ['./hero-slider.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeroSliderComponent implements OnInit {

  slides = [
    {img: '/assets/images/banner-1.jpg'},
    {img: '/assets/images/banner-2.jpg'},
    {img: '/assets/images/banner-3.jpg'},
  ];
  slideConfig = {
    'slidesToShow': 1,
    'infinite': true,
    'arrows': true,
    'dots': true,
    'centerMode': true,
    'fade': true,
    'autoplay': true,
    'autoplaySpeed': 2000,
  };

  constructor( private router: Router ) { }

  ngOnInit() {
  }

  navigateToBuyGzr() {
    this.router.navigate(['/buy-gzr']);
  }
}
