import { Injectable } from '@angular/core';
import { HttpHelperService } from '../../../core/http-helper.service';
import { ApiRoutingService } from '../../../core/api-routing.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ChestService {

  constructor(
    private http: HttpHelperService,
    private apiRoutingService: ApiRoutingService
  ) {
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
