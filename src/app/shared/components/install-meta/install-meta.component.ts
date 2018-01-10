import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'app-install-meta',
  templateUrl: './install-meta.component.html',
  styleUrls: ['./install-meta.component.scss']
})
export class InstallMetaComponent implements OnInit {
  @Input() isInstalled: boolean;
  @Output() onInstall = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  installMetaMask() {
    this.isInstalled = true;
    this.onInstall.emit(this.isInstalled);
  }
}
