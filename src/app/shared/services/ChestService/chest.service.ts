import { Injectable } from '@angular/core';
import { HttpHelperService } from '../../../core/http-helper.service';
import { ApiRoutingService } from '../../../core/api-routing.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ChestService {
  chestId = new Subject<string>();
  chestId$ = this.chestId.asObservable();

  constructor(
    private http: HttpHelperService,
    private apiRoutingService: ApiRoutingService
  ) {
  }

  setChestId(id) {
    this.chestId.next(id);
  }

  getChest(id) {
    return this.http.get(
      this.apiRoutingService.getChestUrlFromID(id),
      {},
      true,
      null
    );
  }

  updateChest(id, data) {
    return this.http.patch(
      this.apiRoutingService.getChestUrlFromID(id),
      data
    );
  }

  createChest() {
    return this.http.put(this.apiRoutingService.getChestUrl(),
      {
        'collection': 'The Founders Edition',
        'price': 1
      }
    );
  }

}
