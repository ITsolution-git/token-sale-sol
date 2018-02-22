import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TreasureItemModalComponent } from '../treasure-item/treasure-item.component';

@Component({
  selector: 'app-waiting-item',
  templateUrl: './waiting-item.component.html',
  styleUrls: ['./waiting-item.component.scss']
})
export class WaitingItemComponent implements OnInit {
  bsModalRef: BsModalRef;

  constructor(
    private modalService: BsModalService
  ) { }

  ngOnInit() {
  }

  openTreasureItem() {
    this.bsModalRef = this.modalService.show(TreasureItemModalComponent);
  }

}
