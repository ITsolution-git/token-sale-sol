import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-locked-meta',
  templateUrl: './locked-meta.component.html',
  styleUrls: ['./locked-meta.component.scss']
})
export class LockedMetaComponent implements OnInit {

  @Input() isMetaLocked: boolean;
  @Output() onShowForm = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  unlockMetaMask() {
    this.isMetaLocked = true;
    this.onShowForm.emit(this.isMetaLocked);
  }

}
