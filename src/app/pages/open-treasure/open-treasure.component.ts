import { Component, OnInit } from '@angular/core';
import { ChestService } from '../../shared/services/ChestService/chest.service';
import { Chest } from '../../shared/models/chest.model';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ApplicationState } from '../../store/application-state';
import { UserState } from '../../store/store-data';
import { MetaMaskService } from '../../shared/services/MetaMaskService/meta-mask.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { LockedModalComponent } from '../../shared/components/locked-modal/locked-modal.component';

@Component({
  selector: 'app-open-treasure',
  templateUrl: './open-treasure.component.html',
  styleUrls: ['./open-treasure.component.scss']
})
export class OpenTreasureComponent implements OnInit {
  chest: Chest;
  userState: Observable<UserState>;
  bsModalRef: BsModalRef;
  unlocked = true;

  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: false
  };

  constructor(
    private chestService: ChestService,
    private metaMaskService: MetaMaskService,
    private router: Router,
    private modalService: BsModalService,
    private store: Store<ApplicationState>
  ) {
    this.userState = this.store.select('userState');
    this.metaMaskService.getAccountInfo();
    this.userState.subscribe(state => {
      if (state.installed === false) {
        this.router.navigate(['/meta-mask']);
      }
      this.unlocked = state.unlocked;
      this.showModals();
    });
  }

  ngOnInit() {
    const cid = 'eeeceb748b383a08a398e260d4a34b91';
    this.chestService.getChest(cid).subscribe(cId => {
        this.chest = cId;
    });
  }

  showModals() {
    if (this.unlocked === false && !this.bsModalRef) {
      this.bsModalRef = this.modalService.show(LockedModalComponent,
        Object.assign({}, this.config, { class: 'gray modal-lg modal-center' }));
    }
  }
}
