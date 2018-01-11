import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-meta-mask',
  templateUrl: './meta-mask.component.html',
  styleUrls: ['./meta-mask.component.scss']
})
export class MetaMaskComponent implements OnInit {
  isInstalled = false;
  isMetaLocked = false;

  constructor( private router: Router ) { }

  ngOnInit() {
  }

  onInstall(isInstalled: boolean) {
    this.isInstalled = isInstalled;
  }

  onShowForm(isMetaLocked: boolean) {
    this.isMetaLocked = isMetaLocked;
    this.router.navigate(['/save-account']);
  }
}
