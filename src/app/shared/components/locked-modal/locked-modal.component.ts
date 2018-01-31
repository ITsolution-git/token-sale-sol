import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-locked-modal',
  templateUrl: './locked-modal.component.html',
  styleUrls: ['./locked-modal.component.scss']
})
export class LockedModalComponent implements OnInit {

  title: string;
  closeBtnName: string;
  list: any[] = [];

  constructor(
    public bsModalRef: BsModalRef,
    private router: Router,
  ) {}

  ngOnInit() {
  }

  navigateToFAQ() {
    this.bsModalRef.hide();
    this.router.navigate(['/faq']);
  }

}
