import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-waiting-treasure-modal',
  templateUrl: './waiting-treasure-modal.component.html',
  styleUrls: ['./waiting-treasure-modal.component.scss']
  // ,

  //  animations: [
  //   trigger('dialog', [
  //     transition('void => *', [
  //       style({ transform: 'scale3d(.3, .3, .3)' }),
  //       animate(100)
  //     ]),
  //     transition('* => void', [
  //       animate(100, style({ transform: 'scale3d(.0, .0, .0)' }))
  //     ])
  //   ])
  // ]
})
export class WaitingTreasureModalComponent implements OnInit {
  // @Input() visible: boolean;
  // @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
     public bsModalRef: BsModalRef
) { 

  }

  ngOnInit() {
  }

    closeModal() {
    this.bsModalRef.hide();
  }

}
