import { Component, OnInit } from '@angular/core';
import { HeaderRoutes } from './header-routing.module';
import { MenuType } from './header.metadata';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public menuItems: any[];
  public brandMenu: any;
  isCollapsed = true;

  constructor() {}

  ngOnInit() {
    this.menuItems = HeaderRoutes;
  }

  public get menuIcon(): string {
    return this.isCollapsed ? '☰' : '✖';
  }
}
