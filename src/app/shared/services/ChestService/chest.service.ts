import { Injectable } from '@angular/core';
import { HttpHelperService } from '../../../core/http-helper.service';
import { ApiRoutingService } from '../../../core/api-routing.service';

@Injectable()
export class ChestService {

  constructor(
    private http: HttpHelperService,
    private apiRoutingService: ApiRoutingService
  ) { }

  getChest(id) {
    return this.http.get(
      this.apiRoutingService.getChestUrlFromID(id),
      {},
      true,
      null
    );
  }

  unlockChest(id, data) {
    return this.http.patch(
      this.apiRoutingService.getChestUrlFromID(id),
      data,
      true,
      null
    );
  }


  createChest() {
    return this.http.put(this.apiRoutingService.getChestUrl(),
      {
        'collection': 'The Founders Edition',
        'price': 1
      },
      true,
      null
    );
  }

  updateChest(chest, userID, transaction) {
    console.log('update chest', this.apiRoutingService.getChestUrlFromID(chest), transaction);

    return this.http.patch(
      this.apiRoutingService.getChestUrlFromID(chest),
      {
        'user': userID,
        'status': 'pending',
        'transaction_id' : transaction
      },
      true,
      null
    );
  }
}
