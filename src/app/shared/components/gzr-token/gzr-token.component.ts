import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-gzr-token',
  templateUrl: './gzr-token.component.html',
  styleUrls: ['./gzr-token.component.scss']
})
export class GzrTokenComponent implements OnInit, AfterViewInit {
  private fragment: string;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.fragment.subscribe(fragment => {
      this.fragment = fragment; });
  }
  ngAfterViewInit(): void {
    try {
      document.querySelector('#token').scrollIntoView();
    } catch (e) { }
  }
}

