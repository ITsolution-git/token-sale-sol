import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { MetaMaskService } from '../../services/MetaMaskService/meta-mask.service';

@Component({
  selector: 'app-install-meta',
  templateUrl: './install-meta.component.html',
  styleUrls: ['./install-meta.component.scss']
})

export class InstallMetaComponent implements OnInit {
  @Input() isInstalled: boolean;
  @Output() onInstall = new EventEmitter<boolean>();

  constructor(
    private metaMaskService: MetaMaskService
  ) { }

  ngOnInit() {
    this.metaMaskService.getUserWalletAddress().subscribe(res => {
      console.log('REsponse from Service!', res);
    });
  }

  installMetaMask() {
    this.isInstalled = true;
    this.onInstall.emit(this.isInstalled);
  }
}
