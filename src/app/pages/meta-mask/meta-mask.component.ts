import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-meta-mask',
  templateUrl: './meta-mask.component.html',
  styleUrls: ['./meta-mask.component.scss']
})
export class MetaMaskComponent implements OnInit {
  isInstalled = false;

  constructor() { }

  ngOnInit() {
  }

  onInstall(isInstalled: boolean) {
    this.isInstalled = isInstalled;
  }
}
