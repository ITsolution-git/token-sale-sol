import { Component, OnInit } from '@angular/core';
import { HeaderRoutes } from './header-routing.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public menuItems: any[];
  public brandMenu: any;
  isCollapsed = true;

  constructor( private router: Router ) {}

  ngOnInit() {
    this.menuItems = HeaderRoutes;
  }

  navgiateToTreasure() {
    this.router.navigate(['/open-treasure']);
  }

  public get menuIcon(): string {
    return this.isCollapsed ? '☰' : '✖';
  }
}
