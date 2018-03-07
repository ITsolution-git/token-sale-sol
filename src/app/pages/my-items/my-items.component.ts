import { Component, OnInit, HostListener } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ItemService } from '../../shared/services/ItemService/item.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ApplicationState } from '../../store/application-state';
import { UserState } from '../../store/store-data';
import { MetaMaskService } from '../../shared/services/MetaMaskService/meta-mask.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UserService } from '../../shared/services/UserService/user.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AuthService } from '../../core/services/auth.service';
import { LockedModalComponent } from '../../shared/components/locked-modal/locked-modal.component';
import { User } from '../../shared/models/user.model';
import { LocalStorageService } from 'ngx-webstorage';
import { Item } from '../../shared/models/item.model';

const unityProgress = UnityProgress;
const unityLoader = UnityLoader;

declare const $: any;

@Component({
  selector: 'app-my-items',
  templateUrl: './my-items.component.html',
  styleUrls: ['./my-items.component.scss']
})
export class MyItemsComponent implements OnInit {
  projectURL = './../../../assets/externals/unity-player/Build/Project.json';
  container = 'gameContainer';
  isMobile = false;
  gameInstance: any;
  unityPlayer: any = '';
  userState: Observable<UserState>;
  bsModalRef: BsModalRef;
  unlocked = true;
  installed = false;
  items: Item[] = [];
  saveUserIDStr = 'user_id';
  walletAddress: String;

  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: false
  };

  constructor(
    private itemService: ItemService,
    private domSanitizer: DomSanitizer,
    private metaMaskService: MetaMaskService,
    private authService: AuthService,
    private router: Router,
    private localStorage: LocalStorageService,
    private userService: UserService,
    private modalService: BsModalService,
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

      if (state) {
        if (state.walletAddress && state.walletAddress !== this.walletAddress) {
          const tAddress = state.walletAddress;
          this.userService.retrieveUser(tAddress).subscribe((resp: User[]) => {
            if (resp.length) {
              const mineIds = [],
                    owns = resp[0].owns;
              this.items = [];

              if (owns.length > 0) {
                for (let i = 0; i < owns.length; i++) {
                  mineIds.push(owns[i].substr(5));
                }
                this.itemService.getItems_by_IDs(mineIds).subscribe((res: Item[]) => {
                  this.items = res;
                });
              }
            }
          });
        }
      }
    });
  }

  ngOnInit() {
    this.isMobile = this.isMobileView();
    this.gameInstance = UnityLoader.instantiate(this.container, this.projectURL, {onProgress: unityProgress});
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
     this.isMobile = this.isMobileView();
  }

  isMobileView() {
    if ($(window).width() > 425) {
        return false;
    }
    return true;
  }

  navgiateToTreasure() {
    this.router.navigate(['/open-treasure']);
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
