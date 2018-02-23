import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ChestService } from '../../services/ChestService/chest.service';
import { Chest } from '../../models/chest.model';
import { ItemService } from '../../services/ItemService/item.service';
import { Item } from '../../models/item.model';

declare var Math;

@Component({
  selector: 'app-treasure-modal',
  templateUrl: './opening-treasure-modal.component.html',
  styleUrls: ['./opening-treasure-modal.component.scss']
})
export class TreasureModalComponent implements OnInit {
  chest: any;
  item: Item;

  constructor(
    public bsModalRef: BsModalRef,
    private chestService: ChestService,
    private itemService: ItemService    
  ) { }

  ngOnInit() {
    const cId = 'eeeceb748b383a08a398e260d4a34b91';
    this.chestService.getChest(cId).subscribe((c: Chest) => {
      if (c.items.length > 0) {
        this.itemService.getItem(c.items[0]).subscribe(item => {
          this.item = item;
        });                  
      }
    });
  }

  openChest() {
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
      this.chest.classList.remove('chest--opened', 'chest--finished');
      this.chest.querySelector('.chest__card-rays').innerHTML = '';
      this.bsModalRef.hide();
  }
}
