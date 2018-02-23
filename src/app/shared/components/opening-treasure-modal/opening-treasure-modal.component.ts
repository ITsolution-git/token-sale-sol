import { Component, OnInit, HostListener } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ChestService } from '../../services/ChestService/chest.service';
import { Chest } from '../../models/chest.model';
import { ItemService } from '../../services/ItemService/item.service';
import { Item } from '../../models/item.model';
import { UserState } from '../../../store/store-data';
import { UserService } from '../../services/UserService/user.service';
import { Observable } from 'rxjs/Observable';
import { User } from '../../models/user.model';
import { Store } from '@ngrx/store';
import { ApplicationState } from '../../../store/application-state';

declare var Math;

@Component({
  selector: 'app-treasure-modal',
  templateUrl: './opening-treasure-modal.component.html',
  styleUrls: ['./opening-treasure-modal.component.scss']
})
export class TreasureModalComponent implements OnInit {
  chest: any;
  item: any;
  chest_model: Chest;
  cId: string = 'eeeceb748b383a08a398e260d4a34b91'; 
  userState: Observable<UserState>;
  walletAddress: String;
  user: User;

  constructor(
    public bsModalRef: BsModalRef,
    private chestService: ChestService,
    private itemService: ItemService,
    private userService: UserService,
    private store: Store<ApplicationState>,    
  ) { 
  	this.item = {
  		resources: {
  			icons: [''],
  			images: [''],
  			videos: [''],
  			model: ['']
  		},
  		meta: {
  			name: '',
  			rarity: ''
  		}
    }
    this.userState = this.store.select('userState');
  }

  ngOnInit() {
    this.chestService.getChest(this.cId).subscribe((c: Chest) => {
      this.chest_model = c;
      if (c.items.length > 0) {
        this.itemService.getItem(c.items[0]).subscribe(item => {
          this.item = item;
        });                  
      }
    });

    this.userState.subscribe(state => {
      if (state) {
        if (state.walletAddress && state.walletAddress !== this.walletAddress ) {
          this.userService.retriveUser(state.walletAddress).subscribe((resp: User[]) => {
            if (resp.length) {
              this.user = resp[0];
            }
          });
        }
      }
    });
  }

  openChest() {
    this.chestService.unlockChest(this.cId, { status: 'unlocked' }).subscribe((c: Chest) => {
    });

    let updated_owns = { "owns": this.user.owns };
    let idx = updated_owns.owns.indexOf(`chest/${this.chest_model.id}`);
    if (idx > -1) {
      updated_owns.owns[idx] = `item/${this.item.id}`;
    } else {
      updated_owns.owns.push(`item/${this.item.id}`);
    }

    this.userService.updateUser(this.user.id, updated_owns).subscribe(c => {});

    const metaData = {
      price: 1,
      'transaction_id': this.chest_model.transaction_id,
      'item_id': this.item.id,
      'open_date': (new Date()).getTime() / 1000
    };
    
    this.eventTrack('opened-treasure', metaData);
  
    this.chest = document.querySelector('.chest');

    if (this.chest.classList.contains('chest--opened')) {
      return;
    }

    this.chest.classList.add('chest--opened');

    for (let i = 1; i < 11; i++) {
        this.addRay(i);
    }

    const t = setInterval(() => this.addParticle(), 20);

    setTimeout(() => {
        clearInterval(t);
    }, 1000);
    setTimeout(() => this.runParticlesBackwards(), 1800);
    setTimeout(() => {
        this.chest.classList.add('chest--finished');
    }, 1950);
    setTimeout(() => this.removeParticles(), 3000);
  }

  addRay(index) {
    const div = document.createElement('div');
    div.classList.add('chest__card-ray',  'chest__card-ray--' + index);
    this.chest.querySelector('.chest__card-rays').appendChild(div);
  }

  addParticle() {
    const div = document.createElement('div');

    div.classList.add('chest__card-particle');

    const rotate = parseInt((Math.random() * 350).toString(), 10);
    const height = parseInt((Math.random() * 100 + 50).toString(), 10);
    const x = parseInt((Math.cos((rotate - 90) * Math.PI / 180) * 400).toString(), 10);
    const y = parseInt((Math.sin((rotate - 90) * Math.PI / 180) * 400).toString(), 10);

    div.style.height = height + 'px';

    const transform = 'translate3d(' + x + 'px,' + y + 'px, 0) rotate(' + rotate + 'deg)';

    div.style.transform = transform;
    div.setAttribute('data-final-position', transform);

    this.chest.querySelector('.chest__card-particles').appendChild(div);

    setTimeout(() => {
        div.style.transform = 'translate3d(0, 0, 0) rotate(' + rotate + 'deg)';
        div.style.opacity = '0';
    }, 50);
  }

  runParticlesBackwards() {
    Array.prototype.slice
        .call(this.chest.querySelectorAll('.chest__card-particle'))
        .forEach((div) => {
            const transform = div.getAttribute('data-final-position');

            div.style.transition = 'none';
            div.style.opacity = 1;

            setTimeout(() => {
                div.style.transition = 'transform .5s ease-in, opacity .3s .3s linear';
                div.style.transform = transform;
                div.style.opacity = 0;
            }, 10);
        });
  }

  removeParticles() {
    this.chest.querySelector('.chest__card-particles').innerHTML = '';
  }

  closeChest() {
    if (this.chest != undefined) {
      this.chest.classList.remove('chest--opened', 'chest--finished');
      this.chest.querySelector('.chest__card-rays').innerHTML = '';
    }
    
    this.bsModalRef.hide();
  }

  eventTrack(event, metadata) {
    if (!(metadata)) {
      (<any>window).Intercom('trackEvent', event);
    } else {
      (<any>window).Intercom('trackEvent', event, metadata);
    }
    return true;
  }  
}
