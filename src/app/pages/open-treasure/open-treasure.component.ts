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
import { AuthService } from '../../core/services/auth.service';
import { LocalStorageService } from 'ngx-webstorage';
import { ItemService } from '../../shared/services/ItemService/item.service';
import { Item } from '../../shared/models/item.model';

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
  installed = false;
  saveUserIDStr = 'user_id';
  items: Item[] = [];

  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: false
  };

  constructor(
    private chestService: ChestService,
    private metaMaskService: MetaMaskService,
    private authService: AuthService,
    private router: Router,
    private localStorage: LocalStorageService,
    private modalService: BsModalService,
    private itemService: ItemService,
    private store: Store<ApplicationState>
  ) {
    this.userState = this.store.select('userState');
    this.metaMaskService.getAccountInfo();
    this.userState.subscribe(state => {
      this.installed = state.installed;
      if (state.installed === false) {
        this.router.navigate(['/meta-mask']);
      } else {
        if (this.authService.checkLogin()) {
          this.unlocked = state.unlocked;
          this.showModals();
        }
      }
    });
  }

  ngOnInit() {
    const cid = 'eeeceb748b383a08a398e260d4a34b91';
    this.chestService.getChest(cid).subscribe(cId => {
        this.chest = cId;
    });

    this.itemService.getItems(10, 1).subscribe((res: Item[]) => {      
      this.itemService.getItems_by_IDs(res[0].current.similar).subscribe((resp: Item[]) => {        
        this.items = resp;
      });
    });    
  }

  showModals() {
    if (this.unlocked === false && !this.bsModalRef) {
      this.bsModalRef = this.modalService.show(LockedModalComponent,
        Object.assign({}, this.config, { class: 'gray modal-lg modal-center' }));
    }

    const userId = this.localStorage.retrieve(this.saveUserIDStr);
    if (!userId && this.unlocked && this.installed) {
      this.router.navigate(['/save-account']);
    }
  }
}
